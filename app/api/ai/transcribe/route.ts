import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as Blob;

  if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

  try {
    const transcription = await openai.audio.transcriptions.create({
      model: "gpt-4o-mini-transcribe",
      file: file as any,
    });

    return NextResponse.json({ text: transcription.text });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Transcription failed" }, { status: 500 });
  }
}
