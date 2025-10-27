import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import path from "path";
import fs from "fs";

export const DELETE = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    const audio = await prisma.audioNote.findUnique({ where: { id: params.id } });
    if (!audio) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const filePath = path.join(process.cwd(), "public", audio.filepath);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await prisma.audioNote.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json({ error: "Failed to delete audio." }, { status: 500 });
  }
};
