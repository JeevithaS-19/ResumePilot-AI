"use client";

import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";

type DragDropAreaProps = {
  onFileSelect: (file: File) => void;
};

export default function DragDropArea({
  onFileSelect,
}: DragDropAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file?: File) => {
    if (!file) return;

    const allowedExtensions = [".pdf", ".doc", ".docx"];
    const extension = file.name
      .toLowerCase()
      .slice(file.name.lastIndexOf("."));

    if (!allowedExtensions.includes(extension)) {
      alert("Please upload a PDF or DOCX file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5 MB.");
      return;
    }

    onFileSelect(file);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFile(e.dataTransfer.files?.[0]);
      }}
      className={`mx-auto max-w-3xl rounded-3xl border-2 border-dashed p-12 text-center transition ${
        isDragging
          ? "border-blue-400 bg-blue-500/10"
          : "border-slate-700 bg-white/[0.04]"
      }`}
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10">
        <UploadCloud className="h-8 w-8 text-blue-400" />
      </div>

      <h2 className="mt-6 text-2xl font-bold text-white">
        Upload Your Resume
      </h2>

      <p className="mt-3 text-slate-400">
        Drag and drop your resume here, or choose a file from your computer.
      </p>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="mt-7 rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-500"
      >
        Choose File
      </button>

      <p className="mt-4 text-sm text-slate-500">
        PDF or DOCX • Maximum 5 MB
      </p>
    </div>
  );
}