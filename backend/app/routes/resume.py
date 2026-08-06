from fastapi import ( 
    APIRouter, UploadFile, File, Depends, HTTPException, status, 
) 
from sqlalchemy.orm import Session 
import shutil 
import os 
import re 
import json
from app.services.parser import extract_text
from app.services.analyzer import (
    detect_sections,
    calculate_ats,
    completeness,
)

from app.database import get_db
from app.models import User, Analysis
from app.routes.auth import get_current_user


router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# =========================================================
# UPLOAD AND ANALYZE RESUME
# =========================================================

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),

    current_user: User = Depends(
        get_current_user
    ),

    db: Session = Depends(get_db),
):

    # =========================================================
    # 1. VALIDATE FILE
    # =========================================================

    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No file was selected.",
        )

    allowed_extensions = {
        ".pdf",
        ".docx",
    }

    extension = os.path.splitext(
        file.filename
    )[1].lower()

    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Only PDF and DOCX resumes are supported."
            ),
        )

    # =========================================================
    # 2. SAVE UPLOADED RESUME
    # =========================================================

    # Use basename so uploaded filenames cannot create
    # unintended paths.
    safe_filename = os.path.basename(
        file.filename
    )

    file_path = os.path.join(
        UPLOAD_DIR,
        safe_filename,
    )

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(
                file.file,
                buffer,
            )

    except Exception as error:
        print(
            "Resume save error:",
            error,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to save the uploaded resume.",
        )

    # =========================================================
    # 3. EXTRACT RESUME TEXT
    # =========================================================

    try:
        text = extract_text(file_path)

    except Exception as error:
        print(
            "Resume parsing error:",
            error,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to read the uploaded resume.",
        )

    if not text or not text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "No readable text was found in the resume."
            ),
        )

    # =========================================================
    # 4. PERSONAL INFORMATION
    # =========================================================

    # Name
    lines = [
        line.strip()
        for line in text.split("\n")
        if line.strip()
    ]

    name = (
        lines[0]
        if lines
        else "Not Found"
    )

    # Email
    email_match = re.search(
        r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}",
        text,
    )

    email = (
        email_match.group()
        if email_match
        else "Not Found"
    )

    # Phone Number
    phone_match = re.search(
        r"(\+91[-\s]?)?[6-9]\d{9}",
        text,
    )

    phone = (
        phone_match.group()
        if phone_match
        else "Not Found"
    )

    # LinkedIn
    linkedin_match = re.search(
        r"(https?://)?(www\.)?linkedin\.com/[^\s]+",
        text,
        re.IGNORECASE,
    )

    linkedin = (
        linkedin_match.group()
        if linkedin_match
        else "Not Found"
    )

    # GitHub
    github_match = re.search(
        r"(https?://)?(www\.)?github\.com/[^\s]+",
        text,
        re.IGNORECASE,
    )

    github = (
        github_match.group()
        if github_match
        else "Not Found"
    )

    # =========================================================
    # 5. SKILLS DATABASE
    # =========================================================

    skills_list = [
        "Python",
        "Java",
        "C",
        "C++",
        "JavaScript",
        "TypeScript",
        "HTML",
        "CSS",
        "React",
        "Next.js",
        "Node.js",
        "Express",
        "MongoDB",
        "MySQL",
        "PostgreSQL",
        "Git",
        "GitHub",
        "Tailwind CSS",
        "FastAPI",
        "Docker",
        "Linux",
        "AWS",
        "Azure",
        "Machine Learning",
        "Data Analytics",
        "Power BI",
        "Excel",
        "NumPy",
        "Pandas",
        "Matplotlib",
        "SQL",
    ]

    found_skills = []

    for skill in skills_list:

        if re.search(
            rf"\b{re.escape(skill)}\b",
            text,
            re.IGNORECASE,
        ):
            found_skills.append(skill)

    # =========================================================
    # 6. DETECT RESUME SECTIONS
    # =========================================================

    sections = detect_sections(text)

    # =========================================================
    # 7. CALCULATE ATS SCORE
    # =========================================================

    score = calculate_ats(
        sections=sections,
        skills=found_skills,
        email=email,
        phone=phone,
        linkedin=linkedin,
        github=github,
    )

    # =========================================================
    # 8. COMPLETENESS SCORE
    # =========================================================

    completeness_score = completeness(
        sections,
        email,
        phone,
    )

    # =========================================================
    # 9. GENERATE SUGGESTIONS
    # =========================================================

    suggestions = []

    if not sections["summary"]:
        suggestions.append(
            "Add a professional summary at the top of your resume."
        )

    if not sections["projects"]:
        suggestions.append(
            "Include at least 2-3 technical projects."
        )

    if not sections["experience"]:
        suggestions.append(
            "Add internships, freelance work, or relevant experience if available."
        )

    if not sections["certifications"]:
        suggestions.append(
            "Add certifications such as NPTEL, Microsoft Learn, Coursera, or Udemy."
        )

    if linkedin == "Not Found":
        suggestions.append(
            "Include your LinkedIn profile."
        )

    if github == "Not Found":
        suggestions.append(
            "Include your GitHub profile."
        )

    if len(found_skills) < 8:
        suggestions.append(
            "Add more technical skills relevant to your target role."
        )

    if score >= 90:
        suggestions.append(
            "Excellent resume! Keep it updated with your latest projects and achievements."
        )

    if not suggestions:
        suggestions.append(
            "Your resume looks strong. Continue adding measurable achievements and relevant experience."
        )

    # =========================================================
    # 10. SAVE ANALYSIS TO DATABASE
    # =========================================================

    try:

        analysis = Analysis(
            user_id=current_user.id,
            filename=safe_filename,
            ats_score=score,
            completeness_score=completeness_score,

            # Store arrays as JSON strings
            skills=json.dumps(
                found_skills
            ),

            suggestions=json.dumps(
                suggestions
            ),
        )

        db.add(analysis)

        db.commit()

        db.refresh(analysis)

    except Exception as error:

        db.rollback()

        print(
            "Analysis database error:",
            error,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=(
                "Resume was analyzed, but the analysis "
                "could not be saved."
            ),
        )

    # =========================================================
    # 11. RESPONSE TO FRONTEND
    # =========================================================

    return {
        "analysis_id": analysis.id,

        "filename": safe_filename,

        "name": name,
        "email": email,
        "phone": phone,
        "linkedin": linkedin,
        "github": github,

        "ats_score": score,
        "completeness_score": completeness_score,

        "sections": sections,

        "skills": found_skills,

        "suggestions": suggestions,

        "text": text[:3000],

        "user_id": current_user.id,

        "saved": True,
    }
    # =========================================================
# GET LOGGED-IN USER'S ANALYSIS HISTORY
# =========================================================

# =========================================================
# GET ANALYSIS HISTORY
# =========================================================

@router.get("/analysis/history")
def get_analysis_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    analyses = (
        db.query(Analysis)
        .filter(
            Analysis.user_id == current_user.id
        )
        .order_by(
            Analysis.created_at.desc()
        )
        .all()
    )

    history = []

    for analysis in analyses:

        try:
            skills = (
                json.loads(analysis.skills)
                if analysis.skills
                else []
            )
        except (json.JSONDecodeError, TypeError):
            skills = []

        try:
            suggestions = (
                json.loads(analysis.suggestions)
                if analysis.suggestions
                else []
            )
        except (json.JSONDecodeError, TypeError):
            suggestions = []

        history.append(
            {
                "id": analysis.id,
                "filename": analysis.filename,
                "ats_score": analysis.ats_score,
                "completeness_score":
                    analysis.completeness_score,
                "skills": skills,
                "suggestions": suggestions,
                "created_at":
                    analysis.created_at.isoformat()
                    if analysis.created_at
                    else None,
            }
        )

    return {
        "user": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
        },
        "total_analyses": len(history),
        "analyses": history,
    }


# =========================================================
# GET SINGLE ANALYSIS
# =========================================================

@router.get("/analysis/{analysis_id}")
def get_analysis_by_id(
    analysis_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    analysis = (
        db.query(Analysis)
        .filter(
            Analysis.id == analysis_id,
            Analysis.user_id == current_user.id,
        )
        .first()
    )

    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found.",
        )

    try:
        skills = (
            json.loads(analysis.skills)
            if analysis.skills
            else []
        )
    except (json.JSONDecodeError, TypeError):
        skills = []

    try:
        suggestions = (
            json.loads(analysis.suggestions)
            if analysis.suggestions
            else []
        )
    except (json.JSONDecodeError, TypeError):
        suggestions = []

    return {
        "id": analysis.id,
        "filename": analysis.filename,
        "ats_score": analysis.ats_score,
        "completeness_score": analysis.completeness_score,
        "skills": skills,
        "suggestions": suggestions,
        "created_at": (
            analysis.created_at.isoformat()
            if analysis.created_at
            else None
        ),
    }
    # =========================================================
# JOB DESCRIPTION MATCHING
# =========================================================

@router.post("/analysis/{analysis_id}/job-match")
def match_job_description(
    analysis_id: int,
    job_description: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Get analysis belonging to logged-in user
    analysis = (
        db.query(Analysis)
        .filter(
            Analysis.id == analysis_id,
            Analysis.user_id == current_user.id,
        )
        .first()
    )

    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found.",
        )

    if not job_description.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Job description cannot be empty.",
        )

    # Resume skills
    try:
        resume_skills = (
            json.loads(analysis.skills)
            if analysis.skills
            else []
        )
    except (json.JSONDecodeError, TypeError):
        resume_skills = []

    # Skills we currently support
    skills_database = [
        "Python",
        "Java",
        "C",
        "C++",
        "JavaScript",
        "TypeScript",
        "HTML",
        "CSS",
        "React",
        "Next.js",
        "Node.js",
        "Express",
        "MongoDB",
        "MySQL",
        "PostgreSQL",
        "Git",
        "GitHub",
        "Tailwind CSS",
        "FastAPI",
        "Docker",
        "Linux",
        "AWS",
        "Azure",
        "Machine Learning",
        "Data Analytics",
        "Power BI",
        "Excel",
        "NumPy",
        "Pandas",
        "Matplotlib",
        "SQL",
    ]

    # Detect skills mentioned in job description
    job_skills = []

    for skill in skills_database:
        if re.search(
            rf"\b{re.escape(skill)}\b",
            job_description,
            re.IGNORECASE,
        ):
            job_skills.append(skill)

    # Compare resume skills with job skills
    resume_skills_lower = {
        skill.lower()
        for skill in resume_skills
    }

    matched_skills = [
        skill
        for skill in job_skills
        if skill.lower() in resume_skills_lower
    ]

    missing_skills = [
        skill
        for skill in job_skills
        if skill.lower() not in resume_skills_lower
    ]

    # Calculate match percentage
    if job_skills:
        match_score = round(
            (len(matched_skills) / len(job_skills)) * 100
        )
    else:
        match_score = 0

    # Recommendations
    recommendations = []

    if missing_skills:
        recommendations.append(
            "Consider adding relevant experience or projects "
            "demonstrating: "
            + ", ".join(missing_skills)
            + "."
        )

    if match_score >= 80:
        recommendations.append(
            "Your resume has a strong technical match for this role."
        )
    elif match_score >= 50:
        recommendations.append(
            "Your resume has a moderate match. Tailor your resume "
            "toward the missing skills before applying."
        )
    else:
        recommendations.append(
            "Your resume currently has a low technical match. "
            "Review the required skills and strengthen the most "
            "important gaps."
        )

    return {
        "analysis_id": analysis.id,
        "filename": analysis.filename,

        "match_score": match_score,

        "resume_skills": resume_skills,
        "job_skills": job_skills,

        "matched_skills": matched_skills,
        "missing_skills": missing_skills,

        "recommendations": recommendations,
    }