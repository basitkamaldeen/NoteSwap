import { NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { question } = await req.json();

    const notes = await prisma.note.findMany({
      where: { userId },
      select: { title: true, content: true },
    });

    if (notes.length === 0)
      return NextResponse.json({ answer: "You have no notes yet." });

    const context = notes.map((n) => `${n.title}:\n${n.content}`).join("\n\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a smart assistant that answers based only on the user's uploaded notes.",
        },
        { role: "user", content: `Notes:\n${context}\n\nQuestion: ${question}` },
      ],
    });

    const answer = completion.choices[0].message?.content?.trim() || "No answer found.";
    return NextResponse.json({ answer });
  } catch (err: any) {
    console.error("RAG Error:", err);
    return NextResponse.json({ error: "Failed to process your question." });
  }
}
