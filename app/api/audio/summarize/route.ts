import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) return NextResponse.json({ error: "Missing text" }, { status: 400 });

    // 🧠 MOCK: Replace with your OpenAI or Gemini API call
    const mockSummary =
      "Summary: The audio discusses key lecture topics and provides clear insights into the main ideas.";

    return NextResponse.json({ summary: mockSummary });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to summarize" }, { status: 500 });
  }
}
