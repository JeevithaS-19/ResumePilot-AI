"use client";

import { Loader2, CheckCircle } from "lucide-react";

const steps = [
  "Reading Resume...",
  "Extracting Skills...",
  "Detecting Projects...",
  "Checking ATS Compatibility...",
  "Finding Missing Skills...",
  "Preparing Career Report...",
];

export default function AnalysisLoader() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-white">
      <Loader2 className="w-14 h-14 animate-spin text-blue-500 mb-8" />

      <h1 className="text-3xl font-bold mb-8">
        ResumePilot AI is analyzing your resume...
      </h1>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-3">
            <CheckCircle className="text-green-500" />
            <span>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}