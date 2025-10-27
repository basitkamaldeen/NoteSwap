import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { noteId, content } = await req.json();
  const version = await prisma.noteVersion.create({
    data: { noteId, content },
  });
  return NextResponse.json(version);
}
