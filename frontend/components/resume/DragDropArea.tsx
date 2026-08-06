"use client";

type DragDropAreaProps = {
  onFileSelect: (file: File) => void;
};

export default function DragDropArea({
  onFileSelect,
}: DragDropAreaProps) {
  return (
    <div className="border-2 border-dashed border-slate-700 rounded-2xl p-12 text-center hover:border-blue-500 transition-all">
      <h2 className="text-2xl font-semibold mb-4">
        Upload Your Resume
      </h2>

      <p className="text-gray-400 mb-6">
        Select a PDF or DOCX file (Max 5 MB)
      </p>

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        className="block mx-auto border p-2 bg-white text-black"
        onChange={(e) => {
        console.log(e.target.files);
        if (e.target.files?.[0]) {
          alert(e.target.files[0].name);
          onFileSelect(e.target.files[0]);
        }
        }}
      />
    </div>
  );
}