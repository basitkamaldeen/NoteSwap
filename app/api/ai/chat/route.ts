import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are NoteSwap’s AI assistant, helpful and smart." },
        { role: "user", content: prompt },
      ],
    });

    const reply = completion.choices[0].message?.content || "I couldn’t generate a reply.";
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("[AI_CHAT_ERROR]", error);
    return NextResponse.json({ reply: "Error generating response." }, { status: 500 });
  }
}
