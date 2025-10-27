import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const GET = async () => {
  try {
    const audios = await prisma.audioNote.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(audios);
  } catch (error) {
    console.error("LIST ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch audios." }, { status: 500 });
  }
};
