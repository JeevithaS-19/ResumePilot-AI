"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FileText,
  Upload,
  Target,
  Sparkles,
  LogOut,
  User,
  ArrowRight,
  ShieldCheck,
  BrainCircuit,
} from "lucide-react";

type UserData = {
  id: number;
  name: string;
  email: string;
};
type Analysis = {
  id: number;
  filename: string;
  ats_score: number;
  completeness_score: number;
  skills: string[];
  suggestions: string[];
  created_at: string | null;
};

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<UserData | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // ==========================================
  // CHECK AUTHENTICATION
  // ==========================================

  useEffect(() => {
  const localToken = localStorage.getItem("resumepilot_token");
  const localUser = localStorage.getItem("resumepilot_user");

  const sessionToken = sessionStorage.getItem("resumepilot_token");
  const sessionUser = sessionStorage.getItem("resumepilot_user");

  const token = localToken || sessionToken;
  const storedUser = localUser || sessionUser;

  if (!token || !storedUser) {
    router.replace("/login");
    return;
  }

  try {
    const parsedUser = JSON.parse(storedUser);

    setUser(parsedUser);
    setCheckingAuth(false);
  } catch (error) {
    console.error("Invalid user data:", error);

    localStorage.removeItem("resumepilot_token");
    localStorage.removeItem("resumepilot_user");

    sessionStorage.removeItem("resumepilot_token");
    sessionStorage.removeItem("resumepilot_user");

    router.replace("/login");
  }
}, [router]);
// ==========================================
// FETCH ANALYSIS HISTORY
// ==========================================

useEffect(() => {
  if (!user) return;

  const fetchHistory = async () => {
    const token =
      localStorage.getItem("resumepilot_token") ||
      sessionStorage.getItem("resumepilot_token");

    if (!token) {
      setLoadingHistory(false);
      return;
    }

    try {
      const response = await fetch(
        "https://resumepilot-ai-35p5.onrender.com/analysis/history",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("resumepilot_token");
        localStorage.removeItem("resumepilot_user");
        sessionStorage.removeItem("resumepilot_token");
        sessionStorage.removeItem("resumepilot_user");

        router.replace("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to load analysis history");
      }

      const data = await response.json();

      setAnalyses(data.analyses || []);
    } catch (error) {
      console.error("History error:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  fetchHistory();
}, [user, router]);
    
  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("resumepilot_token");
    localStorage.removeItem("resumepilot_user");

    sessionStorage.removeItem("resumepilot_token");
    sessionStorage.removeItem("resumepilot_user");

    router.push("/login");
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (checkingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-800 border-t-blue-500" />

          <p className="mt-5 text-slate-400">
            Loading your dashboard...
          </p>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">

      {/* Background */}

      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950/40 to-slate-950" />

      <div className="absolute -left-40 top-20 h-[450px] w-[450px] rounded-full bg-blue-600/10 blur-3xl" />

      <div className="absolute -right-40 bottom-0 h-[450px] w-[450px] rounded-full bg-purple-600/10 blur-3xl" />

      <div className="relative z-10">

        {/* ======================================
            DASHBOARD NAVBAR
        ====================================== */}

        <nav className="border-b border-white/10 bg-slate-950/60 backdrop-blur-xl">

          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

            {/* Logo */}

            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">

                <Sparkles className="h-5 w-5" />

              </div>

              <div className="text-left">

                <h1 className="text-lg font-bold">
                  ResumePilot AI
                </h1>

                <p className="text-xs text-slate-500">
                  Career Intelligence
                </p>

              </div>
            </button>

            {/* User */}

            <div className="flex items-center gap-4">

              <div className="hidden items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2 sm:flex">

                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20">

                  <User className="h-4 w-4 text-blue-400" />

                </div>

                <div>

                  <p className="text-sm font-semibold">
                    {user.name}
                  </p>

                  <p className="text-xs text-slate-500">
                    {user.email}
                  </p>

                </div>

              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-300"
              >
                <LogOut className="h-4 w-4" />

                <span className="hidden sm:inline">
                  Logout
                </span>
              </button>

            </div>

          </div>

        </nav>

        {/* ======================================
            DASHBOARD CONTENT
        ====================================== */}

        <div className="mx-auto max-w-7xl px-6 py-12">

          {/* Welcome */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >

            <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-400">
              Career Dashboard
            </p>

            <h2 className="mt-3 text-4xl font-bold md:text-5xl">
              Welcome back,{" "}
              <span className="text-blue-400">
                {user.name.split(" ")[0]}
              </span>
            </h2>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-400">
              Analyze your resume, identify missing skills,
              improve ATS compatibility and prepare yourself
              for your next opportunity.
            </p>

          </motion.div>

          {/* ======================================
              MAIN ACTION
          ====================================== */}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.1,
            }}
            className="mt-10"
          >

            <div className="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-purple-600/10 p-8 md:p-10">

              <div className="absolute right-0 top-0 h-60 w-60 rounded-full bg-blue-500/10 blur-3xl" />

              <div className="relative z-10 flex flex-col justify-between gap-8 md:flex-row md:items-center">

                <div>

                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/20">

                    <Upload className="h-6 w-6" />

                  </div>

                  <h3 className="text-3xl font-bold">
                    Analyze Your Resume
                  </h3>

                  <p className="mt-3 max-w-xl leading-7 text-slate-400">
                    Upload your resume and receive ATS scoring,
                    section analysis, detected skills,
                    personalized suggestions and job-match
                    insights.
                  </p>

                </div>

                <button
                  onClick={() => router.push("/upload")}
                  className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-4 font-semibold shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
                >
                  Analyze Resume

                  <ArrowRight className="h-5 w-5" />
                </button>

              </div>

            </div>

          </motion.div>

          {/* ======================================
              FEATURE CARDS
          ====================================== */}

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            {/* ATS */}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl"
            >

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">

                <Target className="h-5 w-5 text-blue-400" />

              </div>

              <h3 className="mt-5 font-semibold">
                ATS Analysis
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Check how effectively your resume can perform
                in applicant tracking systems.
              </p>

            </motion.div>

            {/* Skills */}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl"
            >

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10">

                <BrainCircuit className="h-5 w-5 text-purple-400" />

              </div>

              <h3 className="mt-5 font-semibold">
                Skill Detection
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Automatically identify technical skills,
                technologies and important resume keywords.
              </p>

            </motion.div>

            {/* Suggestions */}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl"
            >

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10">

                <Sparkles className="h-5 w-5 text-green-400" />

              </div>

              <h3 className="mt-5 font-semibold">
                Smart Suggestions
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Receive actionable recommendations to
                strengthen your resume.
              </p>

            </motion.div>

            {/* Privacy */}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl"
            >

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10">

                <ShieldCheck className="h-5 w-5 text-cyan-400" />

              </div>

              <h3 className="mt-5 font-semibold">
                Secure Access
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Your account is protected through authenticated
                access.
              </p>

            </motion.div>

          </div>

          {/* ======================================
              GET STARTED SECTION
          ====================================== */}

          <div className="mt-8 grid gap-6 lg:grid-cols-2">

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-7">

              <div className="flex items-center gap-3">

                <FileText className="h-5 w-5 text-blue-400" />

                <h3 className="text-lg font-semibold">
                  Resume Analysis
                </h3>

              </div>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Start a new analysis to evaluate your latest
                resume and discover areas for improvement.
              </p>

              <button
                onClick={() => router.push("/upload")}
                className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-400 transition hover:text-blue-300"
              >
                Start New Analysis

                <ArrowRight className="h-4 w-4" />
              </button>

            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-7">

              <div className="flex items-center gap-3">

                <Target className="h-5 w-5 text-purple-400" />

                <h3 className="text-lg font-semibold">
                  Job Match
                </h3>

              </div>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Add a job description during resume analysis
                to compare your skills with the target role.
              </p>

              <button
                onClick={() => router.push("/job-match")}
                className="mt-5 flex items-center gap-2 text-sm font-semibold text-purple-400 transition hover:text-purple-300"
              >
                Check Job Match

                <ArrowRight className="h-4 w-4" />
              </button>

            </div>
        </div>
            {/* ======================================
    RECENT ANALYSES
====================================== */}

<div className="mt-12">

  <div className="mb-6 flex items-center justify-between">

    <div>
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-400">
        Analysis History
      </p>

      <h3 className="mt-2 text-2xl font-bold">
        Recent Analyses
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        Review your previously analyzed resumes.
      </p>
    </div>

    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2">
      <span className="text-sm text-slate-400">
        Total:{" "}
      </span>

      <span className="font-bold text-white">
        {analyses.length}
      </span>
    </div>

  </div>

  {loadingHistory ? (

    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center">

      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

      <p className="mt-4 text-sm text-slate-400">
        Loading analysis history...
      </p>

    </div>

  ) : analyses.length === 0 ? (

    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-10 text-center">

      <FileText className="mx-auto h-10 w-10 text-slate-600" />

      <h4 className="mt-4 text-lg font-semibold">
        No analyses yet
      </h4>

      <p className="mt-2 text-sm text-slate-500">
        Analyze your first resume and it will appear here.
      </p>

      <button
        onClick={() => router.push("/upload")}
        className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500"
      >
        Analyze Resume
      </button>

    </div>

  ) : (

    <div className="grid gap-5">

      {analyses.slice(0, 5).map((analysis) => (

        <motion.div
  key={analysis.id}
  initial={{ opacity: 0, y: 15 }}
  animate={{ opacity: 1, y: 0 }}
  onClick={() =>
    router.push(`/analysis/${analysis.id}`)
  }
  className="cursor-pointer rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition hover:border-blue-500/30 hover:bg-white/[0.07]"
>

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                <FileText className="h-5 w-5 text-blue-400" />
              </div>

              <div>

                <h4 className="font-semibold text-white">
                  {analysis.filename}
                </h4>

                <p className="mt-1 text-xs text-slate-500">
                  {analysis.created_at
                    ? new Date(
                        analysis.created_at
                      ).toLocaleString()
                    : "Date unavailable"}
                </p>

                {analysis.skills.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">

                    {analysis.skills
                      .slice(0, 6)
                      .map((skill) => (

                        <span
                          key={skill}
                          className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs text-blue-300"
                        >
                          {skill}
                        </span>

                      ))}

                  </div>
                )}

              </div>

            </div>

            <div className="flex gap-3">

              <div className="min-w-[110px] rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-center">

                <p className="text-xs text-slate-500">
                  ATS Score
                </p>

                <p className="mt-1 text-xl font-bold text-blue-400">
                  {analysis.ats_score}%
                </p>

              </div>

              <div className="min-w-[110px] rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-center">

                <p className="text-xs text-slate-500">
                  Complete
                </p>

                <p className="mt-1 text-xl font-bold text-green-400">
                  {analysis.completeness_score}%
                </p>

              </div>

            </div>

          </div>

        </motion.div>

      ))}

    </div>

  )}

</div>

          </div>

        </div>

    </main>
  );
}