const API_BASE_URL = "https://resumepilot-ai-35p5.onrender.com";

export async function uploadResume(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload resume");
  }

  return await response.json();
}