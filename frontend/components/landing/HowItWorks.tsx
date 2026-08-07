import {
  UploadCloud,
  BrainCircuit,
  Target,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UploadCloud,
    title: "Upload Your Resume",
    description:
      "Create your account, sign in, and securely upload your resume for analysis.",
  },
  {
    number: "02",
    icon: BrainCircuit,
    title: "Get Resume Insights",
    description:
      "ResumePilot AI analyzes your resume and provides ATS-focused scores, strengths, weaknesses, and improvement suggestions.",
  },
  {
    number: "03",
    icon: Target,
    title: "Match With Jobs",
    description:
      "Compare your resume with a job description to identify matching skills, missing skills, and your overall job-match score.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-slate-950 px-6 py-24 text-white"
    >
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-400">
            How It Works
          </p>

          <h2 className="text-3xl font-bold md:text-5xl">
            From resume to job-ready in three steps
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-400">
            Upload your resume, understand where you can improve,
            and compare your skills with the jobs you want.
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-6 lg:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="relative"
              >
                <div
                  className="
                    h-full rounded-2xl border border-slate-800
                    bg-slate-900/60 p-8
                    transition duration-300
                    hover:-translate-y-1
                    hover:border-blue-500/40
                    hover:bg-slate-900
                  "
                >
                  <div className="mb-7 flex items-center justify-between">

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/15">
                      <Icon className="h-7 w-7 text-blue-400" />
                    </div>

                    <span className="text-4xl font-bold text-slate-800">
                      {step.number}
                    </span>

                  </div>

                  <h3 className="text-xl font-semibold">
                    {step.title}
                  </h3>

                  <p className="mt-4 leading-7 text-slate-400">
                    {step.description}
                  </p>
                </div>

                {/* Arrow between desktop cards */}
                {index < steps.length - 1 && (
                  <div className="absolute -right-5 top-1/2 z-10 hidden -translate-y-1/2 lg:block">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-950">
                      <ArrowRight className="h-4 w-4 text-blue-400" />
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}