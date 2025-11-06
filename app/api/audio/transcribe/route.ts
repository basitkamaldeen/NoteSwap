import fs from "fs";
import path from "path";

export const runtime = "nodejs";

function mimeFromFilename(name: string) {
  const ext = (name || "").split(".").pop()?.toLowerCase() || "webm";
  switch (ext) {
    case "wav":
    case "wave":
    case "waveform":
      return "audio/wav";
    case "mp3":
    case "mpeg":
      return "audio/mpeg";
    case "m4a":
      return "audio/x-m4a";
    case "ogg":
      return "audio/ogg";
    case "flac":
      return "audio/flac";
    case "webm":
    default:
      return "audio/webm";
  }
}

async function tryPostRawBytes(hfUrl: string, apiKey: string | undefined, bytes: Buffer, contentType: string) {
  try {
    const res = await fetch(hfUrl, {
      method: "POST",
      headers: {
        Authorization: apiKey ? `Bearer ${apiKey}` : "",
        "Content-Type": contentType,
      },
      body: bytes,
    });
    return res;
  } catch (err) {
    throw err;
  }
}

async function tryGradioRunPredict(hfBase: string, apiKey: string | undefined, bytes: Buffer, contentType: string) {
  // Gradio often expects JSON: { "data": ["data:<mime>;base64,<b64>"] }
  const b64 = bytes.toString("base64");
  const payload = { data: [`data:${contentType};base64,${b64}`] };

  const candidates = [
    `${hfBase.replace(/\/$/, "")}/run/predict`,
    `${hfBase.replace(/\/$/, "")}/api/predict/`,
    `${hfBase.replace(/\/$/, "")}/predict`,
  ];

  for (const url of candidates) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: apiKey ? `Bearer ${apiKey}` : "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) return res;
      // else keep trying other endpoints
    } catch (err) {
      // continue trying
    }
  }
  throw new Error("All Gradio run/predict attempts failed.");
}

export async function POST(req: Request) {
  console.log("🟡 [Transcribe] Request received...");

  try {
    const formData = await req.formData();
    const file = formData.get("audio") as File | null;

    if (!file) {
      console.error("❌ No audio file received.");
      return new Response(JSON.stringify({ error: "No audio file received." }), { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const safeName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    const filePath = path.join(uploadDir, safeName);
    fs.writeFileSync(filePath, bytes);
    console.log(`✅ Saved file to ${filePath}`);

    const HF_URL = process.env.HUGGINGFACE_API_URL || "";
    const HF_API_KEY = process.env.HUGGINGFACE_API_KEY || process.env.HF_API_KEY || undefined;
    const contentType = mimeFromFilename(file.name);

    if (!HF_URL) {
      console.warn("No HUGGINGFACE_API_URL configured, returning saved file path only.");
      return new Response(JSON.stringify({ text: "", audioUrl: `/uploads/${safeName}` }), { status: 200 });
    }

    console.log("🚀 [Transcribe] Sending request to Hugging Face Space (base):", HF_URL);

    // 1) Try raw POST to base URL (some spaces / inference endpoints accept raw bytes)
    try {
      const candidateUrl = HF_URL; // user-provided; can be full path
      let res = await tryPostRawBytes(candidateUrl, HF_API_KEY, bytes, contentType);
      const text = await res.text();
      console.log("📡 [Transcribe] response status:", res.status, "body snippet:", (text || "").slice(0, 400));

      if (res.ok) {
        // parse JSON if possible
        try {
          const json = JSON.parse(text);
          // Some spaces return { "text": "..." } or { "transcription": "..." } or a nested shape
          const t = json.text || json.transcription || json[0] || json.result || json.data || json?.data?.[0];
          const transcript = typeof t === "string" ? t : JSON.stringify(t).slice(0, 200);
          return new Response(JSON.stringify({ text: transcript, audioUrl: `/uploads/${safeName}` }), { status: 200 });
        } catch {
          // not JSON; maybe raw text
          return new Response(JSON.stringify({ text: text, audioUrl: `/uploads/${safeName}` }), { status: 200 });
        }
      } else {
        // fall through to gradio try
        console.warn("Raw POST to HF_URL failed - falling back to run/predict.");
      }
    } catch (err) {
      console.warn("Raw bytes POST failed:", (err as any)?.message || err);
    }

    // 2) Try Gradio-style run/predict with base64 payload
    try {
      const res2 = await tryGradioRunPredict(HF_URL, HF_API_KEY, bytes, contentType);
      const body = await res2.text();
      console.log("📡 [Transcribe] Gradio run/predict status:", res2.status, "body snippet:", (body || "").slice(0, 600));

      if (res2.ok) {
        try {
          const json = JSON.parse(body);
          // Gradio usually returns { "data": [...], "duration": ... } or {"data":[{"text":"..."}]}
          // We'll try common shapes:
          let transcript = "";
          if (json?.data && Array.isArray(json.data)) {
            // sometimes first element is the text or an array
            const first = json.data[0];
            if (typeof first === "string") transcript = first;
            else if (first?.text) transcript = first.text;
            else if (Array.isArray(first) && typeof first[0] === "string") transcript = first[0];
            else transcript = JSON.stringify(json.data).slice(0, 300);
          } else if (json?.value) {
            transcript = json.value;
          } else if (json?.text) {
            transcript = json.text;
          } else {
            transcript = JSON.stringify(json).slice(0, 500);
          }
          return new Response(JSON.stringify({ text: transcript, audioUrl: `/uploads/${safeName}` }), { status: 200 });
        } catch (err) {
          return new Response(JSON.stringify({ text: body, audioUrl: `/uploads/${safeName}` }), { status: 200 });
        }
      }
    } catch (err) {
      console.warn("Gradio fallback failed:", (err as any)?.message || err);
    }

    // nothing worked
    return new Response(
      JSON.stringify({
        error: "All remote transcribe attempts failed. File saved locally.",
        audioUrl: `/uploads/${safeName}`,
      }),
      { status: 500 }
    );
  } catch (err: any) {
    console.error("❌ [Transcribe Error]:", err);
    return new Response(JSON.stringify({ error: err?.message || "unknown error" }), { status: 500 });
  }
}
