import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import prisma from "@/lib/prisma";

export const POST = async (req: Request) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as Blob;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}_${Math.random().toString(36).substring(7)}.mp3`;
    const filePath = path.join(process.cwd(), "public", "uploads", filename);

    await writeFile(filePath, buffer);

    const audio = await prisma.audioNote.create({
      data: {
        filename,
        filepath: `/uploads/${filename}`,
      },
    });

    return NextResponse.json({ success: true, audio });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
};
