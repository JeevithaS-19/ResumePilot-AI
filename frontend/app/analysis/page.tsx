export default function AnalysisPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Resume Analysis</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-slate-900 p-6 rounded-2xl">
          <h2 className="text-xl font-semibold">ATS Score</h2>
          <p className="text-5xl font-bold text-blue-500 mt-4">87%</p>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl">
          <h2 className="text-xl font-semibold">Resume Score</h2>
          <p className="text-5xl font-bold text-green-500 mt-4">82%</p>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl">
          <h2 className="text-xl font-semibold">Job Match</h2>
          <p className="text-5xl font-bold text-purple-500 mt-4">75%</p>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

        <div className="bg-slate-900 p-6 rounded-2xl">
          <h2 className="text-2xl font-semibold mb-4">Skills Found</h2>
          <ul className="space-y-2">
            <li>✅ Python</li>
            <li>✅ Java</li>
            <li>✅ HTML</li>
            <li>✅ CSS</li>
          </ul>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl">
          <h2 className="text-2xl font-semibold mb-4">Missing Skills</h2>
          <ul className="space-y-2">
            <li>❌ React</li>
            <li>❌ Docker</li>
            <li>❌ SQL</li>
          </ul>
        </div>

      </div>

      <div className="bg-slate-900 p-6 rounded-2xl mt-8">
        <h2 className="text-2xl font-semibold mb-4">AI Suggestions</h2>
        <ul className="space-y-2">
          <li>• Add measurable achievements.</li>
          <li>• Improve project descriptions.</li>
          <li>• Include more ATS keywords.</li>
          <li>• Highlight technical skills near the top.</li>
        </ul>
      </div>
    </main>
  );
}