// app/api/folders/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = auth();
  const folders = await prisma.note.findMany({
    where: { userId },
    select: { tags: true },
  });
  // derive unique tags as folders
  const all = folders.flatMap((f) => (f.tags ? f.tags.split(",") : []));
  const unique = Array.from(new Set(all.map((s) => s.trim()).filter(Boolean)));
  return NextResponse.json(unique);
}
