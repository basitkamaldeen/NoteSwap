import fs from "fs";
import path from "path";

export const runtime = "nodejs";

/**
 * Derive a reasonable mime type from file name
 */
function mimeFromFilename(name: string) {
  const ext = (name || "").split(".").pop()?.toLowerCase() || "webm";
  switch (ext) {
    case "wav":
    case "wave":
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
  const headers: Record<string, string> = {
    "Content-Type": contentType,
  };
  if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;

  return fetch(hfUrl, {
    method: "POST",
    headers,
    body: bytes,
  });
}

async function tryGradioRunPredict(hfBase: string, apiKey: string | undefined, bytes: Buffer, contentType: string) {
  const b64 = bytes.toString("base64");
  const payload = { data: [`data:${contentType};base64,${b64}`] };

  const candidates = [
    `${hfBase.replace(/\/$/, "")}/run/predict`,
    `${hfBase.replace(/\/$/, "")}/api/predict/`,
    `${hfBase.replace(/\/$/, "")}/predict`,
  ];

  for (const url of candidates) {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;

      const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
      if (res.ok) return res;
    } catch (err) {
      // try next candidate
      continue;
    }
  }
  throw new Error("All Gradio run/predict attempts failed.");
}

async function tryPostFormData(hfUrl: string, apiKey: string | undefined, bytes: Buffer, filename: string, contentType: string) {
  // Build a simple multipart body (boundary-based) to avoid relying on global FormData
  const boundary = "----hfbound" + Date.now();
  const prefix = `--${boundary}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"${filename}\"\r\nContent-Type: ${contentType}\r\n\r\n`;
  const suffix = `\r\n--${boundary}--\r\n`;
  const body = Buffer.concat([Buffer.from(prefix, "utf-8"), bytes, Buffer.from(suffix, "utf-8")]);

  const headers: Record<string, string> = {
    "Content-Type": `multipart/form-data; boundary=${boundary}`,
    "Content-Length": body.length.toString(),
  };
  if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;

  return fetch(hfUrl, {
    method: "POST",
    headers,
    body,
  });
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

    // Use env var if provided; otherwise default to the HF space you supplied
    const HF_URL = (process.env.HUGGINGFACE_API_URL || "https://basitkhayy-whisper-api.hf.space/").trim();
    const HF_API_KEY = process.env.HUGGINGFACE_API_KEY || process.env.HF_API_KEY || undefined;
    const contentType = mimeFromFilename(file.name);

    if (!HF_URL) {
      console.warn("No HUGGINGFACE_API_URL configured, returning saved file path only.");
      return new Response(JSON.stringify({ text: "", audioUrl: `/uploads/${safeName}` }), { status: 200 });
    }

    console.log("🚀 [Transcribe] Sending request to Hugging Face Space / Inference:", HF_URL);

    let finalText = "";
    let lastError = "";

    // Try raw POST first (some endpoints accept raw bytes)
    try {
      const res = await tryPostRawBytes(HF_URL, HF_API_KEY, bytes, contentType);
      const txt = await res.text();
      console.log("📡 [Transcribe] raw POST status:", res.status);

      if (res.ok) {
        try {
          const json = JSON.parse(txt);
          const candidate = json?.text || json?.transcription || json?.transcript || json?.result || json?.data || json?.output || json;
          finalText = typeof candidate === "string" ? candidate : JSON.stringify(candidate);
        } catch {
          // raw text
          finalText = txt;
        }
      } else {
        lastError = `Raw POST failed: ${res.status} ${txt}`;
        console.warn(lastError);
      }
    } catch (err: any) {
      lastError = err?.message || String(err);
      console.warn("Raw bytes POST attempt failed:", lastError);
    }

    // If raw POST didn't produce a transcript, try Gradio run/predict JSON
    if (!finalText) {
      try {
        const res2 = await tryGradioRunPredict(HF_URL, HF_API_KEY, bytes, contentType);
        const body = await res2.text();
        console.log("📡 [Transcribe] Gradio run/predict status:", res2.status);

        if (res2.ok) {
          try {
            const json = JSON.parse(body);
            // common shapes: { data: [...] } or { text: '...' }
            if (json?.data && Array.isArray(json.data)) {
              const first = json.data[0];
              if (typeof first === "string") finalText = first;
              else if (first?.text) finalText = first.text;
              else finalText = JSON.stringify(json.data);
            } else if (json?.text) {
              finalText = json.text;
            } else {
              finalText = JSON.stringify(json);
            }
          } catch {
            finalText = body;
          }
        } else {
          lastError = `Gradio run/predict failed: ${res2.status} ${body}`;
          console.warn(lastError);
        }
      } catch (err: any) {
        lastError = err?.message || String(err);
        console.warn("Gradio run/predict attempt failed:", lastError);
      }
    }

    // As a final attempt, try multipart/form-data upload to base URL
    if (!finalText) {
      try {
        const res3 = await tryPostFormData(HF_URL, HF_API_KEY, bytes, file.name, contentType);
        const body3 = await res3.text();
        console.log("📡 [Transcribe] FormData upload status:", res3.status);

        if (res3.ok) {
          try {
            const json = JSON.parse(body3);
            finalText = json?.text || json?.transcription || json?.result || (json?.data ? JSON.stringify(json.data) : JSON.stringify(json));
          } catch {
            finalText = body3;
          }
        } else {
          lastError = `FormData upload failed: ${res3.status} ${body3}`;
          console.warn(lastError);
        }
      } catch (err: any) {
        lastError = err?.message || String(err);
        console.warn("FormData attempt failed:", lastError);
      }
    }

    if (!finalText) {
      console.error("❌ [Transcribe] No transcript produced. Last error:", lastError);
      return new Response(
        JSON.stringify({
          error: "All remote transcribe attempts failed. File saved locally.",
          debug: lastError,
          audioUrl: `/uploads/${safeName}`,
        }),
        { status: 502 }
      );
    }

    console.log("✅ [Transcribe] Transcript (snippet):", finalText?.slice(0, 300));
    return new Response(JSON.stringify({ text: finalText, audioUrl: `/uploads/${safeName}` }), { status: 200 });
  } catch (err: any) {
    console.error("❌ [Transcribe Error]:", err);
    return new Response(JSON.stringify({ error: err?.message || "unknown error" }), { status: 500 });
  }
}