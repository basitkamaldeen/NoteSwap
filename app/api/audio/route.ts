import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Receive audio file
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file)
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });

    // Save file to /public/uploads/audio
    const uploadDir = path.join(process.cwd(), "public", "uploads", "audio");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, `${Date.now()}-${file.name}`);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);
    const audioUrl = `/uploads/audio/${path.basename(filePath)}`;

    // Create DB entry first
    const audioNote = await prisma.audioNote.create({
      data: { userId, audioUrl, title: file.name },
    });

    // ---------- AI PROCESSING ----------
    // Step 1: Transcribe using OpenAI Whisper
    const transcriptionResponse = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath) as any,
      model: "whisper-1",
      response_format: "text",
    });
    const transcript = transcriptionResponse.trim();

    // Step 2: Summarize with GPT-4
    const summaryResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that summarizes lecture transcripts clearly.",
        },
        {
          role: "user",
          content: `Summarize this transcript in concise bullet points:\n${transcript}`,
        },
      ],
    });

    const summary =
      summaryResponse.choices[0]?.message?.content || "No summary generated.";

    // Step 3: Update DB with transcript + summary
    await prisma.audioNote.update({
      where: { id: audioNote.id },
      data: { transcript, summary },
    });

    return NextResponse.json({
      success: true,
      message: "Audio uploaded, transcribed, and summarized.",
      audioNote,
    });
  } catch (error) {
    console.error("AUDIO_UPLOAD_AI_ERROR:", error);
    return NextResponse.json({ error: "Failed to process audio" }, { status: 500 });
  }
}
