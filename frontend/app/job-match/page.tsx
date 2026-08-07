"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function JobMatchPage() {
  const router = useRouter();

  const [jobDescription, setJobDescription] = useState("");
  type Analysis = {
  id: number;
  filename: string;
  ats_score: number;
  completeness_score: number;
  skills: string[];
};

const [analyses, setAnalyses] = useState<Analysis[]>([]);
const [selectedAnalysisId, setSelectedAnalysisId] = useState<number | null>(
  null
);
const [loadingResumes, setLoadingResumes] = useState(true);
type JobMatchResult = {
  analysis_id: number;
  filename: string;
  match_score: number;
  resume_skills: string[];
  job_skills: string[];
  matched_skills: string[];
  missing_skills: string[];
  recommendations: string[];
};

const [matching, setMatching] = useState(false);
const [matchResult, setMatchResult] =
  useState<JobMatchResult | null>(null);
const [matchError, setMatchError] = useState("");
useEffect(() => {
  const fetchResumes = async () => {
    const token =
      localStorage.getItem("resumepilot_token") ||
      sessionStorage.getItem("resumepilot_token");

    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const response = await fetch(
        "https://resumepilot-ai-35p5.onrender.com/analysis/history",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401 || response.status === 403) {
        router.replace("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Unable to load resumes.");
      }

      const data = await response.json();

      setAnalyses(data.analyses || []);

      // Automatically select newest resume
      if (data.analyses?.length > 0) {
        setSelectedAnalysisId(data.analyses[0].id);
      }
    } catch (error) {
      console.error("Resume loading error:", error);
    } finally {
      setLoadingResumes(false);
    }
  };

  fetchResumes();
}, [router]);
const handleJobMatch = async () => {
  if (!selectedAnalysisId || !jobDescription.trim()) {
    return;
  }

  const token =
    localStorage.getItem("resumepilot_token") ||
    sessionStorage.getItem("resumepilot_token");

  if (!token) {
    router.replace("/login");
    return;
  }

  setMatching(true);
  setMatchError("");
  setMatchResult(null);

  try {
    const response = await fetch(
      `https://resumepilot-ai-35p5.onrender.com/${selectedAnalysisId}/job-match?job_description=${encodeURIComponent(
        jobDescription
      )}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 401 || response.status === 403) {
      router.replace("/login");
      return;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail || "Unable to analyze job match."
      );
    }

    setMatchResult(data);
  } catch (error) {
    console.error("Job match error:", error);

    setMatchError(
      error instanceof Error
        ? error.message
        : "Unable to analyze job match."
    );
  } finally {
    setMatching(false);
  }
};

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">

        {/* Back Button */}
        <button
          onClick={() => router.push("/dashboard")}
          className="text-blue-400 transition hover:text-blue-300"
        >
          ← Back to Dashboard
        </button>

        {/* Heading */}
        <div className="mt-12">
          <p className="text-sm uppercase tracking-[0.25em] text-purple-400">
            AI Job Matching
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            Check Your Job Match
          </h1>

          <p className="mt-4 max-w-2xl text-slate-400">
            Paste a job description below and compare it with your resume
            to identify matching skills, missing skills, and areas for
            improvement.
          </p>
        </div>
        {/* Resume Selection */}

<div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-7">
  <h2 className="text-xl font-semibold">
    Select Resume
  </h2>

  <p className="mt-1 text-sm text-slate-400">
    Choose one of your previously analyzed resumes.
  </p>

  {loadingResumes ? (
    <p className="mt-5 text-sm text-slate-400">
      Loading your resumes...
    </p>
  ) : analyses.length === 0 ? (
    <div className="mt-5">
      <p className="text-sm text-slate-400">
        You don't have any analyzed resumes yet.
      </p>

      <button
        onClick={() => router.push("/upload")}
        className="mt-4 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold hover:bg-blue-500"
      >
        Analyze a Resume
      </button>
    </div>
  ) : (
    <select
      value={selectedAnalysisId ?? ""}
      onChange={(e) =>
        setSelectedAnalysisId(Number(e.target.value))
      }
      className="mt-5 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-4 text-white outline-none transition focus:border-purple-500"
    >
      {analyses.map((analysis) => (
        <option
          key={analysis.id}
          value={analysis.id}
        >
          {analysis.filename} — ATS {analysis.ats_score}%
        </option>
      ))}
    </select>
  )}
</div>

        {/* Job Description */}
        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-7">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Job Description
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Paste the complete job description from the company.
              </p>
            </div>

            <span className="text-sm text-slate-500">
              {jobDescription.length} characters
            </span>
          </div>

          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Example: We are looking for a Software Engineer with experience in Python, React, SQL, AWS, Git..."
            className="mt-6 min-h-[300px] w-full resize-none rounded-xl border border-slate-700 bg-slate-950 p-5 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500"
          />

          <button
  onClick={handleJobMatch}
  disabled={
    !jobDescription.trim() ||
    !selectedAnalysisId ||
    matching
  }
  className="mt-5 w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
>
  {matching
    ? "Analyzing Job Match..."
    : "Analyze Job Match"}
</button>
        </div>
        {/* Job Match Error */}

{matchError && (
  <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-300">
    {matchError}
  </div>
)}

{/* ======================================
    JOB MATCH RESULTS
====================================== */}

{matchResult && (
  <div className="mt-10 space-y-6">

    {/* Match Score */}

    <div className="rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-600/15 via-blue-600/10 to-slate-950 p-8">

      <p className="text-sm font-medium uppercase tracking-[0.2em] text-purple-400">
        Job Match Result
      </p>

      <div className="mt-5 flex flex-col justify-between gap-6 md:flex-row md:items-center">

        <div>
          <h2 className="text-2xl font-bold">
            {matchResult.filename}
          </h2>

          <p className="mt-2 text-slate-400">
            Resume compatibility with this job description.
          </p>
        </div>

        <div className="text-left md:text-right">
          <p className="text-sm text-slate-400">
            Match Score
          </p>

          <p className="mt-1 text-5xl font-bold text-purple-400">
            {matchResult.match_score}%
          </p>
        </div>

      </div>

    </div>

    {/* Matched + Missing Skills */}

    <div className="grid gap-6 md:grid-cols-2">

      {/* Matched */}

      <div className="rounded-2xl border border-green-500/20 bg-green-500/[0.06] p-7">

        <h3 className="text-xl font-bold text-green-400">
          Matched Skills
        </h3>

        <p className="mt-2 text-sm text-slate-400">
          Skills found in both your resume and the job description.
        </p>

        {matchResult.matched_skills.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-2">

            {matchResult.matched_skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-sm text-green-300"
              >
                {skill}
              </span>
            ))}

          </div>
        ) : (
          <p className="mt-5 text-sm text-slate-500">
            No matching skills detected.
          </p>
        )}

      </div>

      {/* Missing */}

      <div className="rounded-2xl border border-orange-500/20 bg-orange-500/[0.06] p-7">

        <h3 className="text-xl font-bold text-orange-400">
          Missing Skills
        </h3>

        <p className="mt-2 text-sm text-slate-400">
          Skills requested by the job but not detected in your resume.
        </p>

        {matchResult.missing_skills.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-2">

            {matchResult.missing_skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1.5 text-sm text-orange-300"
              >
                {skill}
              </span>
            ))}

          </div>
        ) : (
          <p className="mt-5 text-sm text-green-400">
            Great — no missing technical skills were detected.
          </p>
        )}

      </div>

    </div>

    {/* Recommendations */}

    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-7">

      <h3 className="text-xl font-bold">
        Recommendations
      </h3>

      <p className="mt-2 text-sm text-slate-400">
        Ways to improve your resume for this role.
      </p>

      <div className="mt-5 space-y-3">

        {matchResult.recommendations.map(
          (recommendation, index) => (
            <div
              key={index}
              className="rounded-xl border border-white/10 bg-slate-950/50 p-4 text-sm leading-6 text-slate-300"
            >
              <span className="mr-2 font-semibold text-purple-400">
                {index + 1}.
              </span>

              {recommendation}
            </div>
          )
        )}

      </div>

    </div>

  </div>
)}

      </div>
    </main>
  );
}