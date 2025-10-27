import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(_: Request, { params }: any) {
  const note = await prisma.note.update({
    where: { id: params.id },
    data: { likes: { increment: 1 } },
  });
  return NextResponse.json(note);
}
