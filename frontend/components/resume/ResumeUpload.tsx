"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import DragDropArea from "./DragDropArea";
import AnalysisLoader from "./AnalysisLoader";

import { generateReport } from "../../utils/generateReport";

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);


  if (analyzing) {
    return <AnalysisLoader />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950"
    >
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* Hero */}

        <div className="text-center mb-14">

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-6xl font-extrabold text-white"
          >
            ResumePilot AI
          </motion.h1>

          <p className="mt-5 text-xl text-slate-300">
            AI Powered Resume Analysis & ATS Optimization
          </p>

        </div>

        {!file ? (

          <DragDropArea onFileSelect={setFile} />

        ) : (

          <>

            {/* Upload Card */}

            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.25 }}
              className="
                backdrop-blur-xl
                bg-white/10
                border
                border-white/20
                rounded-3xl
                shadow-2xl
                p-10
              "
            >

              <h2 className="text-3xl font-bold text-white">
                Resume Ready
              </h2>

              <p className="mt-6 text-lg text-slate-200">
                📄 {file.name}
              </p>

              <p className="text-slate-400">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>

              
<button
  onClick={async () => {
    if (!file) return;

    setAnalyzing(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token =
        localStorage.getItem("resumepilot_token") ||
        sessionStorage.getItem("resumepilot_token");

      if (!token) {
        alert("Your session has expired. Please login again.");
        window.location.href = "/login";
        return;
      }

      const response = await fetch(
        "https://resumepilot-ai-35p5.onrender.com/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        localStorage.removeItem("resumepilot_token");
        localStorage.removeItem("resumepilot_user");

        sessionStorage.removeItem("resumepilot_token");
        sessionStorage.removeItem("resumepilot_user");

        alert("Your session has expired. Please login again.");
        window.location.href = "/login";
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Resume analysis failed."
        );
      }

      console.log("Resume analysis saved:", data);
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      setAnalyzing(false);
    }
  }}
  className="
    mt-8
    w-full
    bg-gradient-to-r
    from-blue-600
    to-indigo-600
    hover:from-blue-700
    hover:to-indigo-700
    transition
    py-4
    rounded-2xl
    font-bold
    text-lg
    text-white
    shadow-lg
  "
>
  🚀 Analyze Resume

</button>
</motion.div>
               
{result && (

<motion.div
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  className="mt-14"
>

  <h2 className="text-5xl font-bold text-center text-white mb-12">
    Resume Analysis Dashboard
  </h2>

  {/* Top Dashboard Cards */}

  <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

    {/* ATS Score */}

    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-xl"
    >

      <p className="text-blue-300 text-lg font-semibold">
        ATS Score
      </p>

      <h1 className="text-6xl font-bold text-white mt-4">
        {result.ats_score}
      </h1>

      <div className="w-full bg-slate-700 rounded-full h-3 mt-6">

        <div
          className="bg-blue-500 h-3 rounded-full transition-all duration-700"
          style={{ width: `${result.ats_score}%` }}
        />

      </div>

    </motion.div>

    {/* Resume Completeness */}

    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-xl"
    >

      <p className="text-green-300 text-lg font-semibold">
        Resume Completeness
      </p>

      <h1 className="text-6xl font-bold text-white mt-4">
        {result.completeness_score}%
      </h1>

      <div className="w-full bg-slate-700 rounded-full h-3 mt-6">

        <div
          className="bg-green-500 h-3 rounded-full transition-all duration-700"
          style={{
            width: `${result.completeness_score}%`,
          }}
        />

      </div>

    </motion.div>

    {/* Resume File */}

    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-xl"
    >

      <p className="text-purple-300 text-lg font-semibold">
        Resume File
      </p>

      <h2 className="text-white text-xl mt-5 break-all">
        {result.filename}
      </h2>

    </motion.div>

    {/* Skills */}

    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-xl"
    >

      <p className="text-cyan-300 text-lg font-semibold mb-5">
        Skills
      </p>

      <div className="flex flex-wrap gap-2">

        {result.skills.length > 0 ? (

          result.skills.map((skill: string) => (

            <span
              key={skill}
              className="
              px-4
              py-2
              rounded-full
              bg-cyan-500/20
              border
              border-cyan-400
              text-cyan-200
              text-sm
              "
            >
              {skill}
            </span>

          ))

        ) : (

          <p className="text-slate-400">
            No skills detected
          </p>

        )}

      </div>

    </motion.div>

  </div>

                            {/* Personal Information */}

<div className="mt-10 grid lg:grid-cols-2 gap-8">

  <motion.div
    initial={{ opacity: 0, x: -30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6 }}
    className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8"
  >

    <h2 className="text-3xl font-bold text-cyan-300 mb-6">
      👤 Personal Information
    </h2>

    <div className="space-y-5">

      <div>
        <p className="text-slate-400">Name</p>
        <p className="text-white text-lg font-semibold">
          {result.name || "Not Found"}
        </p>
      </div>

      <div>
        <p className="text-slate-400">Email</p>
        <p className="text-white break-all">
          {result.email || "Not Found"}
        </p>
      </div>

      <div>
        <p className="text-slate-400">Phone</p>
        <p className="text-white">
          {result.phone || "Not Found"}
        </p>
      </div>

      <div>
        <p className="text-slate-400">LinkedIn</p>
        <p className="text-blue-300 break-all">
          {result.linkedin || "Not Found"}
        </p>
      </div>

      <div>
        <p className="text-slate-400">GitHub</p>
        <p className="text-blue-300 break-all">
          {result.github || "Not Found"}
        </p>
      </div>

    </div>

  </motion.div>

  {/* Resume Sections */}

  <motion.div
    initial={{ opacity: 0, x: 30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6 }}
    className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8"
  >

    <h2 className="text-3xl font-bold text-blue-300 mb-6">
      📑 Resume Sections
    </h2>

    <div className="grid grid-cols-2 gap-4">

      {Object.entries(result.sections).map(([key, value]) => (

        <div
          key={key}
          className="bg-white/5 rounded-2xl p-4"
        >

          <p className="capitalize text-white font-semibold">
            {key}
          </p>

          <p
            className={`mt-2 font-bold ${
              value
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {value ? "✓ Detected" : "✗ Missing"}
          </p>

        </div>

      ))}

    </div>

  </motion.div>

</div>


              {/* AI Suggestions */}

<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  className="mt-10 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8"
>

  <h2 className="text-3xl font-bold text-yellow-300 mb-8">
    💡 AI Suggestions
  </h2>

  <div className="grid gap-4">

    {result.suggestions.length > 0 ? (

      result.suggestions.map(
        (item: string, index: number) => (

          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            className="bg-yellow-500/10 border border-yellow-400 rounded-2xl p-5"
          >

            <p className="text-yellow-100">
              ✅ {item}
            </p>

          </motion.div>

        )
      )

    ) : (

      <p className="text-slate-400">
        No suggestions available.
      </p>

    )}

  </div>

</motion.div>

{/* Resume Preview */}

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.8 }}
  className="mt-10 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8"
>

  <h2 className="text-3xl font-bold text-white mb-8">
    📄 Resume Preview
  </h2>

  <div
    className="
      bg-slate-900/60
      rounded-2xl
      p-6
      max-h-[500px]
      overflow-y-auto
      whitespace-pre-wrap
      text-slate-200
      leading-7
    "
  >
    {result.text}
  </div>

</motion.div>

{/* Download Report */}

<div className="mt-10 flex justify-center">

  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => generateReport(result)}
    className="
      px-10
      py-4
      rounded-2xl
      font-bold
      text-lg
      bg-gradient-to-r
      from-green-500
      to-emerald-600
      hover:from-green-600
      hover:to-emerald-700
      shadow-xl
      text-white
    "
  >
    📄 Download PDF Report
  </motion.button>

</div>

</motion.div>

)}

</>

)}

</div>

</motion.div>

);
}