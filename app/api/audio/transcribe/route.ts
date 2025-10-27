import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export async function POST(req: Request) {
  console.log("🟡 [Transcribe] Request received...");

  const formData = await req.formData();
  const file = formData.get("audio") as File | null;

  if (!file) {
    console.error("❌ No audio file received.");
    return new Response(JSON.stringify({ error: "No audio file received." }), { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const filePath = path.join(uploadDir, `${Date.now()}-${file.name}`);

  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  fs.writeFileSync(filePath, bytes);
  console.log(`✅ Saved file to ${filePath}`);

  try {
    const HF_MODEL = "openai/whisper-large-v3";
    const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
    const HF_URL = `https://api-inference.huggingface.co/models/${HF_MODEL}`;

    console.log("🚀 [Transcribe] Sending request to Hugging Face API...");

    const response = await fetch(HF_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "audio/webm",
      },
      // ✅ Include language hint to force English
      body: fs.readFileSync(filePath),
      duplex: "half",
    });

    const text = await response.text();
    console.log(`📡 [Transcribe] Hugging Face status: ${response.status}`);
    console.log("🧾 [Transcribe] Raw response:", text);

    if (!response.ok) throw new Error(text);

    const data = JSON.parse(text);

    // ✅ Auto-translate foreign transcriptions to English (optional)
    let transcription = data.text;
    if (!/^[a-zA-Z0-9\s.,!?'"-]+$/.test(transcription)) {
      console.log("🌍 Detected foreign language, translating to English...");
      const translationRes = await fetch("https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-mul-en", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: transcription }),
      });

      const translation = await translationRes.json();
      transcription = translation[0]?.translation_text || transcription;
    }

    return new Response(JSON.stringify({ text: transcription }), { status: 200 });
  } catch (err: any) {
    console.error("❌ [Transcribe Error]:", err.message);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
