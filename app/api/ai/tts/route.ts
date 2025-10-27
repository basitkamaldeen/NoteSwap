import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: Request) {
  const { text } = await req.json();

  try {
    const mp3 = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "alloy",
      input: text,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    return new NextResponse(buffer, {
      headers: { "Content-Type": "audio/mpeg" },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "TTS failed" }, { status: 500 });
  }
}
