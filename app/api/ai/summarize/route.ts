import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: "No content provided to summarize." });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an intelligent summarizer that explains notes clearly in concise academic style.",
        },
        { role: "user", content: `Summarize this note:\n\n${content}` },
      ],
    });

    const summary = completion.choices[0].message?.content?.trim() || "";
    return NextResponse.json({ summary });
  } catch (err: any) {
    console.error("Summarizer Error:", err);
    return NextResponse.json({ error: "Failed to summarize note." });
  }
}
