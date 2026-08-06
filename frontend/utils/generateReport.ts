import jsPDF from "jspdf";

export function generateReport(
  result: any,
  matchScore: number | null,
  matchedSkills: string[],
  missingSkills: string[]
) {
  const doc = new jsPDF();

  let y = 20;

  doc.setFontSize(20);
  doc.text("ResumePilot AI Report", 20, y);

  y += 15;

  doc.setFontSize(14);
  doc.text(`Name: ${result.name}`, 20, y);
  y += 10;

  doc.text(`Email: ${result.email}`, 20, y);
  y += 10;

  doc.text(`Phone: ${result.phone}`, 20, y);
  y += 10;

  doc.text(`ATS Score: ${result.score}/100`, 20, y);
  y += 15;

  if (matchScore !== null) {
    doc.text(`Job Match Score: ${matchScore}%`, 20, y);
    y += 15;
  }

  doc.setFontSize(16);
  doc.text("Skills", 20, y);

  y += 10;

  doc.setFontSize(12);

  result.skills.forEach((skill: string) => {
    doc.text(`• ${skill}`, 25, y);
    y += 8;
  });

  y += 8;

  doc.setFontSize(16);
  doc.text("AI Suggestions", 20, y);

  y += 10;

  doc.setFontSize(12);

  result.suggestions.forEach((item: string) => {
    const lines = doc.splitTextToSize(item, 170);
    doc.text(lines, 25, y);
    y += lines.length * 7;
  });

  if (matchScore !== null) {
    y += 10;

    doc.setFontSize(16);
    doc.text("Matched Skills", 20, y);

    y += 10;

    doc.setFontSize(12);

    matchedSkills.forEach((skill) => {
      doc.text(`• ${skill}`, 25, y);
      y += 8;
    });

    y += 8;

    doc.setFontSize(16);
    doc.text("Missing Skills", 20, y);

    y += 10;

    doc.setFontSize(12);

    missingSkills.forEach((skill) => {
      doc.text(`• ${skill}`, 25, y);
      y += 8;
    });
  }

  doc.save("ResumePilotAI_Report.pdf");
}