import jsPDF from "jspdf";

export function generateReport(result: any) {
  const doc = new jsPDF();

  let y = 20;

  doc.setFontSize(20);
  doc.text("ResumePilot AI - Resume Analysis Report", 20, y);

  y += 15;

  doc.setFontSize(14);

  doc.text(`Name: ${result.name || "Not Found"}`, 20, y);
  y += 10;

  doc.text(`Email: ${result.email || "Not Found"}`, 20, y);
  y += 10;

  doc.text(`Phone: ${result.phone || "Not Found"}`, 20, y);
  y += 10;

  doc.text(`ATS Score: ${result.ats_score ?? 0}/100`, 20, y);
  y += 10;

  doc.text(
    `Resume Completeness: ${result.completeness_score ?? 0}%`,
    20,
    y
  );

  y += 15;

  // Skills
  doc.setFontSize(16);
  doc.text("Detected Skills", 20, y);

  y += 10;

  doc.setFontSize(12);

  if (result.skills?.length > 0) {
    result.skills.forEach((skill: string) => {
      doc.text(`• ${skill}`, 25, y);
      y += 8;
    });
  } else {
    doc.text("No skills detected.", 25, y);
    y += 8;
  }

  y += 8;

  // AI Suggestions
  doc.setFontSize(16);
  doc.text("Improvement Suggestions", 20, y);

  y += 10;

  doc.setFontSize(12);

  if (result.suggestions?.length > 0) {
    result.suggestions.forEach((item: string) => {
      const lines = doc.splitTextToSize(
        `• ${item}`,
        165
      );

      // Add a new page if necessary
      if (y + lines.length * 7 > 280) {
        doc.addPage();
        y = 20;
      }

      doc.text(lines, 25, y);
      y += lines.length * 7 + 3;
    });
  } else {
    doc.text("No suggestions available.", 25, y);
  }

  doc.save("ResumePilotAI_Resume_Analysis.pdf");
}