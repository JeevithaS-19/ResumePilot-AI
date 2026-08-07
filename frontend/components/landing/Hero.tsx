"use client";

import Link from "next/link";
import { Upload, PlayCircle, CheckCircle, ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="bg-slate-950 text-white min-h-[calc(100vh-80px)]">
      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28 grid lg:grid-cols-2 gap-16 items-center">

        {/* Left Section */}
        <div>
          <span className="inline-flex items-center bg-blue-600/20 text-blue-400 px-4 py-2 rounded-full text-sm font-medium">
            🚀 AI Career Copilot
          </span>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mt-7 leading-[1.08]">
            Analyze.
            <br />
            Improve.
            <br />
            <span className="text-blue-500">
              Get Hired.
            </span>
          </h1>

          <p className="text-gray-400 mt-7 text-lg leading-8 max-w-xl">
            ResumePilot AI analyzes your resume, identifies improvement
            opportunities, evaluates ATS compatibility, and helps you
            understand how well your skills match a job.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mt-10">

            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500"
            >
              <Upload className="h-5 w-5" />
              Analyze My Resume
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-6 py-3 font-semibold text-gray-200 transition hover:bg-slate-800 hover:border-slate-600"
            >
              <PlayCircle className="h-5 w-5" />
              See How It Works
            </a>

          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap gap-6 mt-10 text-sm text-gray-400">

            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-500 h-5 w-5" />
              ATS Analysis
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-500 h-5 w-5" />
              AI Powered
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-500 h-5 w-5" />
              Job Matching
            </div>

          </div>
        </div>

        {/* Right Section */}
        <div className="flex justify-center lg:justify-end">

          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 md:p-10 w-full max-w-md shadow-2xl">

            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-sm text-blue-400 font-medium">
                  AI Resume Insights
                </p>

                <h2 className="text-2xl font-bold mt-1">
                  Resume Analysis
                </h2>
              </div>

              <div className="h-12 w-12 rounded-xl bg-blue-600/15 flex items-center justify-center">
                <Upload className="h-6 w-6 text-blue-400" />
              </div>
            </div>

            <div className="space-y-7">

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">ATS Score</span>
                  <span className="text-blue-400 font-semibold">
                    91%
                  </span>
                </div>

                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full w-[91%] bg-blue-500 rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Resume Score</span>
                  <span className="text-green-400 font-semibold">
                    88%
                  </span>
                </div>

                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full w-[88%] bg-green-500 rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Job Match</span>
                  <span className="text-purple-400 font-semibold">
                    86%
                  </span>
                </div>

                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full w-[86%] bg-purple-500 rounded-full" />
                </div>
              </div>

              <div className="pt-5 border-t border-slate-800">
                <p className="text-sm text-gray-500 mb-3">
                  Skills to strengthen
                </p>

                <div className="flex gap-2">
                  <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full text-sm">
                    Docker
                  </span>

                  <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full text-sm">
                    AWS
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}