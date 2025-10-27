// app/api/notes/search/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const { q } = await req.json();
    if (!q) return NextResponse.json([], { status: 200 });

    const notes = await prisma.note.findMany({
      where: {
        userId,
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { content: { contains: q, mode: "insensitive" } },
          { tags: { contains: q, mode: "insensitive" } },
        ],
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(notes);
  } catch (e) {
    console.error("SEARCH_ERROR", e);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
