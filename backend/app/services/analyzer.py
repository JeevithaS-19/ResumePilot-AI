import re

def detect_sections(text: str):
    lower = text.lower()

    sections = {
        "education": any(word in lower for word in [
            "education", "b.e", "btech", "b.tech", "degree",
            "university", "college"
        ]),

        "experience": any(word in lower for word in [
            "experience", "intern", "employment", "work experience"
        ]),

        "projects": any(word in lower for word in [
            "project", "projects"
        ]),

        "certifications": any(word in lower for word in [
            "certification", "certifications", "certificate",
            "nptel", "coursera", "udemy", "microsoft"
        ]),

        "summary": any(word in lower for word in [
            "summary", "objective", "profile"
        ]),
    }

    return sections


def calculate_ats(
    sections,
    skills,
    email,
    phone,
    linkedin,
    github,
):
    score = 0

    # Contact
    if email != "Not Found":
        score += 5

    if phone != "Not Found":
        score += 5

    # Profiles
    if linkedin != "Not Found":
        score += 5

    if github != "Not Found":
        score += 5

    # Resume Sections
    if sections["education"]:
        score += 15

    if sections["projects"]:
        score += 20

    if sections["experience"]:
        score += 20

    if sections["certifications"]:
        score += 10

    if sections["summary"]:
        score += 5

    # Skills
    score += min(25, len(skills) * 2)

    return min(score, 100)


def completeness(sections, email, phone):
    total = 7
    completed = 0

    if email != "Not Found":
        completed += 1

    if phone != "Not Found":
        completed += 1

    for value in sections.values():
        if value:
            completed += 1

    percent = round((completed / total) * 100)

    return percent