import {
  FileSearch,
  Target,
  Sparkles,
  BarChart3,
  ShieldCheck,
  Download,
} from "lucide-react";

const features = [
  {
    icon: FileSearch,
    title: "ATS Resume Analysis",
    description:
      "Analyze your resume and get an ATS-focused score with actionable feedback.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Insights",
    description:
      "Identify resume strengths, weaknesses, and areas that can be improved.",
  },
  {
    icon: Target,
    title: "Job Match",
    description:
      "Compare your resume with a job description and discover matched and missing skills.",
  },
  {
    icon: BarChart3,
    title: "Detailed Analysis",
    description:
      "View structured resume insights and understand where your profile can improve.",
  },
  {
    icon: Download,
    title: "Downloadable Report",
    description:
      "Generate and download your resume analysis report for future reference.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Authentication",
    description:
      "Create an account and securely access your resume analysis tools.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="bg-slate-950 px-6 py-24 text-white"
    >
      <div className="mx-auto max-w-7xl">

        {/* Section heading */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-400">
            Powerful Features
          </p>

          <h2 className="text-3xl font-bold md:text-5xl">
            Everything you need to improve your resume
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-400">
            ResumePilot AI combines resume analysis, ATS insights,
            job matching, and downloadable reports in one platform.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="
                  group rounded-2xl border border-slate-800
                  bg-slate-900/60 p-7
                  transition duration-300
                  hover:-translate-y-1
                  hover:border-blue-500/40
                  hover:bg-slate-900
                "
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/15">
                  <Icon className="h-6 w-6 text-blue-400" />
                </div>

                <h3 className="text-xl font-semibold">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}