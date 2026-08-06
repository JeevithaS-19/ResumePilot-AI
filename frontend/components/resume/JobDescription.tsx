"use client";

interface Props {
  jobDescription: string;
  setJobDescription: (value: string) => void;
}

export default function JobDescription({
  jobDescription,
  setJobDescription,
}: Props) {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-700 p-8 mt-8">
      <h2 className="text-2xl font-bold text-white mb-4">
        Job Description
      </h2>

      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Paste the job description here..."
        className="w-full h-56 bg-slate-800 text-white rounded-xl p-4 outline-none border border-slate-600"
      />
    </div>
  );
}