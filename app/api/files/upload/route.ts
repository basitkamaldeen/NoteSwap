// app/api/files/upload/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const { filename, data } = await req.json(); // data is base64 string
    if (!filename || !data) return NextResponse.json({ error: "Invalid" }, { status: 400 });

    const uploads = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploads)) fs.mkdirSync(uploads, { recursive: true });

    const buffer = Buffer.from(data.split(",")[1] || data, "base64");
    const filePath = path.join(uploads, filename);
    fs.writeFileSync(filePath, buffer);

    const url = `/uploads/${filename}`;
    return NextResponse.json({ url });
  } catch (e) {
    console.error("UPLOAD_ERROR", e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
