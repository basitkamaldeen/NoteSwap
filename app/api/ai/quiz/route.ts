import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    if (!content) return NextResponse.json({ error: "No content provided for quiz generation." });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a quiz generator that creates 5 short Q&A pairs from study notes.",
        },
        { role: "user", content: `Generate quiz questions from this note:\n\n${content}` },
      ],
    });

    const quiz = completion.choices[0].message?.content?.trim() || "";
    return NextResponse.json({ quiz });
  } catch (err: any) {
    console.error("Quiz Error:", err);
    return NextResponse.json({ error: "Failed to generate quiz." });
  }
}
