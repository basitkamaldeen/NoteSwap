import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: Request) {
  try {
    const { text, tone } = await req.json();

    if (!text) return NextResponse.json({ error: "No text provided to rewrite." });

    const prompt = `Rephrase the following text in a ${tone || "simpler"} and clearer tone:\n\n${text}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const rewritten = completion.choices[0].message?.content?.trim() || "";
    return NextResponse.json({ rewritten });
  } catch (err: any) {
    console.error("Rewriter Error:", err);
    return NextResponse.json({ error: "Failed to rewrite text." });
  }
}
