"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Upload, PlayCircle, CheckCircle } from "lucide-react";

export default function Hero() {
  return (
    <section className="min-h-[90vh] bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">

        {/* Left Section */}
        <div>

          <span className="bg-blue-600/20 text-blue-400 px-4 py-2 rounded-full text-sm">
            🚀 AI Career Copilot
          </span>

          <h1 className="text-5xl md:text-6xl font-bold mt-6 leading-tight">
            Analyze.
            <br />
            Improve.
            <br />
            <span className="text-blue-500">
              Get Hired.
            </span>
          </h1>

          <p className="text-gray-400 mt-8 text-lg leading-8">
            ResumePilot AI analyzes your resume, detects mistakes,
            rewrites weak sections using AI, predicts career growth,
            and helps you become job-ready.
          </p>

          <div className="flex gap-4 mt-10">

            {/* Upload Resume Button */}
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/upload">
                <Upload className="mr-2 h-5 w-5" />
                Upload Resume
              </Link>
            </Button>

            {/* Watch Demo Button */}
            <Button variant="outline" size="lg">
              <PlayCircle className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>

          </div>

          <div className="flex flex-wrap gap-6 mt-10 text-gray-400">

            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-500 h-5 w-5" />
              ATS Optimized
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-500 h-5 w-5" />
              AI Powered
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-500 h-5 w-5" />
              Secure
            </div>

          </div>

        </div>

        {/* Right Section */}
        <div className="flex justify-center">

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 w-full max-w-md shadow-2xl">

            <h2 className="text-2xl font-bold mb-8">
              Resume Analysis
            </h2>

            <div className="space-y-6">

              <div>
                <div className="flex justify-between">
                  <span>ATS Score</span>
                  <span className="text-blue-400 font-semibold">
                    91%
                  </span>
                </div>
              </div>

              <div>
                <div className="flex justify-between">
                  <span>Resume Score</span>
                  <span className="text-green-400 font-semibold">
                    88%
                  </span>
                </div>
              </div>

              <div>
                <div className="flex justify-between">
                  <span>Job Match</span>
                  <span className="text-purple-400 font-semibold">
                    86%
                  </span>
                </div>
              </div>

              <div>
                <div className="flex justify-between">
                  <span>Missing Skills</span>
                  <span className="text-red-400 font-semibold">
                    Docker, AWS
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