import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const note = {
      id: Date.now().toString(),
      title: body.title || `Audio note ${new Date().toISOString()}`,
      transcript: body.transcript || "",
      audioUrl: body.audioUrl || "",
      createdAt: new Date().toISOString(),
    };

    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    const filePath = path.join(dataDir, "audioNotes.json");

    let existing: any[] = [];
    if (fs.existsSync(filePath)) {
      try {
        existing = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      } catch (e) {
        existing = [];
      }
    }

    existing.unshift(note);
    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2), "utf-8");

    return new Response(JSON.stringify({ ok: true, note }), { status: 200 });
  } catch (err: any) {
    console.error("Save route error:", err);
    return new Response(JSON.stringify({ error: err?.message || "unknown" }), { status: 500 });
  }
}
