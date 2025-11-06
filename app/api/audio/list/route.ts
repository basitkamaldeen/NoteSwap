// app/api/audio/list/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const notes = await prisma.audioNote.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json({ notes });
  } catch (err: any) {
    console.error("Fetch audio notes error", err);
    return NextResponse.json({ error: err?.message ?? "Failed to fetch" }, { status: 500 });
  }
}
