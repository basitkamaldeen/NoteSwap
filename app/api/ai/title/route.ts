// app/api/ai/title/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { content } = await req.json();
    const prompt = `Suggest 3 short, catchy titles (6 words max) for the following study note. Return as JSON array.\n\n${content}`;
    const res = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
    });
    const out = res.choices?.[0]?.message?.content ?? "";
    // try parse JSON, but if not, return raw
    try {
      const parsed = JSON.parse(out);
      return NextResponse.json({ titles: parsed });
    } catch {
      return NextResponse.json({ titles: out.split("\n").map((s: string)=>s.trim()).filter(Boolean) });
    }
  } catch (e) {
    console.error("TITLE_ERROR", e);
    return NextResponse.json({ error: "Failed to generate titles" }, { status: 500 });
  }
}
