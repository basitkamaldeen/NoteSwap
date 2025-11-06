import fetch from "node-fetch";

export const runtime = "nodejs";

function simpleExtractiveSummary(text: string, maxSentences = 3) {
  // naive: split on punctuation and return first N non-empty sentences
  const sentences = text
    .replace(/\n+/g, " ")
    .split(/([.?!]\s+)/)
    .reduce<string[]>((acc, cur) => {
      if (!cur) return acc;
      // stitch pair-splitting from regex
      if (/[.?!]\s+$/.test(cur) && acc.length) {
        const last = acc.pop()!;
        acc.push((last + cur).trim());
      } else if (!/[.?!]\s+$/.test(cur)) {
        acc.push(cur.trim());
      } else {
        acc.push(cur.trim());
      }
      return acc;
    }, [])
    .filter(Boolean);
  if (sentences.length <= maxSentences) return text;
  return sentences.slice(0, maxSentences).join(" ");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const text: string = body?.text || "";
    if (!text) return new Response(JSON.stringify({ error: "No text provided" }), { status: 400 });

    const HF_SUM_URL = process.env.HUGGINGFACE_SUMMARY_API_URL;
    const HF_API_KEY = process.env.HUGGINGFACE_API_KEY || process.env.HF_API_KEY;

    if (HF_SUM_URL) {
      // try remote HF summarizer (user-provided)
      try {
        const res = await fetch(HF_SUM_URL, {
          method: "POST",
          headers: {
            Authorization: HF_API_KEY ? `Bearer ${HF_API_KEY}` : "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputs: text }),
        });
        const raw = await res.text();
        try {
          const json = JSON.parse(raw);
          // common shapes: { summary_text: "..." } or returned string
          const summary = json.summary_text || json?.[0]?.summary_text || (typeof json === "string" ? json : JSON.stringify(json));
          return new Response(JSON.stringify({ summary: summary || simpleExtractiveSummary(text) }), { status: 200 });
        } catch {
          return new Response(JSON.stringify({ summary: raw || simpleExtractiveSummary(text) }), { status: 200 });
        }
      } catch (err) {
        console.warn("HF summary call failed, falling back to local summary:", (err as any)?.message);
      }
    }

    // fallback to simple extractive summary
    const summary = simpleExtractiveSummary(text, 3);
    return new Response(JSON.stringify({ summary }), { status: 200 });
  } catch (err: any) {
    console.error("Summarize error:", err);
    return new Response(JSON.stringify({ error: err?.message || "unknown" }), { status: 500 });
  }
}
