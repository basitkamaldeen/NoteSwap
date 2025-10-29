import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import formidable from "formidable";
import fs from "fs";

export const runtime = "nodejs"; // Needed because we use fs

// Initialize Supabase client using service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const form = formidable({ multiples: false });
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req as any, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    // @ts-ignore
    const file = files.file;
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const buffer = await fs.promises.readFile(file.filepath);
    const fileName = `recordings/${Date.now()}-${file.originalFilename}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("audio")
      .upload(fileName, buffer, { contentType: file.mimetype || "audio/webm" });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: publicData } = supabase.storage
      .from("audio")
      .getPublicUrl(fileName);

    console.log("✅ Uploaded:", publicData.publicUrl);
    return NextResponse.json({ url: publicData.publicUrl });
  } catch (err: any) {
    console.error("Upload failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
