import { NextResponse } from "next/server";
import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as Blob | null;

    if (!audioFile) {
      return NextResponse.json({ error: "No audio provided." }, { status: 400 });
    }

    const buffer = Buffer.from(await audioFile.arrayBuffer());
    const tempPath = path.join("/tmp", "note_audio.webm");
    fs.writeFileSync(tempPath, buffer);

    // Step 1: Transcribe
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempPath),
      model: "gpt-4o-mini-transcribe",
    });

    // Step 2: Summarize
    const summary = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Summarize the following lecture or note in a clear, concise format for students:" },
        { role: "user", content: transcription.text },
      ],
    });

    fs.unlinkSync(tempPath);

    return NextResponse.json({ summary: summary.choices[0].message.content });
  } catch (error: any) {
    console.error("Audio summarize error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
