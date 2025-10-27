import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  const { noteId } = await req.json();
  const shareId = randomUUID();
  await prisma.note.update({
    where: { id: noteId },
    data: { shareId, isPublic: true },
  });
  return NextResponse.json({ shareUrl: `${process.env.NEXT_PUBLIC_URL}/share/${shareId}` });
}
