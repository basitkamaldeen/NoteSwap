"use client";

export async function summarizeText(text: string): Promise<string> {
  try {
    const res = await fetch("/api/ai/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const data = await res.json();
    return data.summary || "No summary generated.";
  } catch {
    return "Summarization failed.";
  }
}
