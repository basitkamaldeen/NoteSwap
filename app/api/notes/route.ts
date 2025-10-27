import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notes = await prisma.note.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error("[GET_NOTES_ERROR]", error);
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content, tags } = await req.json();

    const note = await prisma.note.create({
      data: {
        title: title || "Untitled Note",
        content: content || "",
        tags: Array.isArray(tags) ? tags.join(",") : "",
        userId,
      },
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error("[CREATE_NOTE_ERROR]", error);
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
  }
}
