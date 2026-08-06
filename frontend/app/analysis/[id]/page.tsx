"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Analysis = {
  id: number;
  filename: string;
  ats_score: number;
  completeness_score: number;
  skills: string[];
  suggestions: string[];
  created_at: string | null;
};

export default function AnalysisDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [analysis, setAnalysis] =
    useState<Analysis | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalysis = async () => {
      const token =
        localStorage.getItem("resumepilot_token") ||
        sessionStorage.getItem("resumepilot_token");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/analysis/${params.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("resumepilot_token");
          localStorage.removeItem("resumepilot_user");

          sessionStorage.removeItem("resumepilot_token");
          sessionStorage.removeItem("resumepilot_user");

          router.replace("/login");
          return;
        }

        if (response.status === 404) {
          setError("Analysis not found.");
          return;
        }

        if (!response.ok) {
          throw new Error("Unable to load analysis.");
        }

        const data = await response.json();

        setAnalysis(data);
      } catch (error) {
        console.error(error);
        setError("Unable to load this analysis.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [params.id, router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-800 border-t-blue-500" />

          <p className="mt-4 text-slate-400">
            Loading analysis...
          </p>
        </div>
      </main>
    );
  }

  if (error || !analysis) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            {error || "Analysis not found."}
          </h1>

          <button
            onClick={() => router.push("/dashboard")}
            className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500"
          >
            Back to Dashboard
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">

        <button
          onClick={() => router.push("/dashboard")}
          className="mb-8 text-sm font-medium text-blue-400 hover:text-blue-300"
        >
          ← Back to Dashboard
        </button>

        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-400">
            Resume Analysis
          </p>

          <h1 className="mt-3 text-3xl font-bold md:text-4xl">
            {analysis.filename}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {analysis.created_at
              ? new Date(analysis.created_at).toLocaleString()
              : "Date unavailable"}
          </p>
        </div>

        {/* Scores */}

        <div className="mt-10 grid gap-6 md:grid-cols-2">

          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-7">
            <p className="text-sm text-slate-400">
              ATS Score
            </p>

            <p className="mt-3 text-5xl font-bold text-blue-400">
              {analysis.ats_score}%
            </p>
          </div>

          <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-7">
            <p className="text-sm text-slate-400">
              Resume Completeness
            </p>

            <p className="mt-3 text-5xl font-bold text-green-400">
              {analysis.completeness_score}%
            </p>
          </div>

        </div>

        {/* Skills */}

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-7">
          <h2 className="text-xl font-bold">
            Detected Skills
          </h2>

          {analysis.skills.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-3">
              {analysis.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-slate-500">
              No skills were detected.
            </p>
          )}
        </div>

        {/* Suggestions */}

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-7">
          <h2 className="text-xl font-bold">
            Improvement Suggestions
          </h2>

          {analysis.suggestions.length > 0 ? (
            <div className="mt-5 space-y-3">
              {analysis.suggestions.map(
                (suggestion, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-white/10 bg-slate-950/40 p-4 text-sm leading-6 text-slate-300"
                  >
                    <span className="mr-2 text-blue-400">
                      {index + 1}.
                    </span>

                    {suggestion}
                  </div>
                )
              )}
            </div>
          ) : (
            <p className="mt-4 text-slate-500">
              No suggestions available.
            </p>
          )}
        </div>

      </div>
    </main>
  );
}