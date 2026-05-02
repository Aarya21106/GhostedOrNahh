import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildPrompt } from "@/lib/prompt";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

/**
 * Single endpoint: Images + Context → Gemini → Verdict
 *
 * No separate OCR. No parser. No normalizer. No signal extractor.
 * Gemini reads the screenshots directly, understands the conversation
 * in any language, and returns a structured behavioral analysis.
 */
export async function POST(req) {
  try {
    const { images, context } = await req.json();

    // ── Validation ──────────────────────────────────────────────
    if (!images || !Array.isArray(images) || images.length === 0) {
      return Response.json(
        { error: "No images provided" },
        { status: 400 }
      );
    }

    if (images.length > 5) {
      return Response.json(
        { error: "Maximum 5 screenshots allowed" },
        { status: 400 }
      );
    }

    // ── Build Gemini parts ──────────────────────────────────────
    // Images come as data URLs: "data:image/png;base64,iVBORw0KG..."
    const imageParts = images.map((dataUrl) => {
      const match = dataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
      if (!match) {
        throw new Error("Invalid image format. Expected data URL.");
      }
      return {
        inlineData: {
          mimeType: match[1],
          data: match[2],
        },
      };
    });

    // ── Build the master prompt ─────────────────────────────────
    const prompt = buildPrompt(context || {});

    // ── Call Gemini ─────────────────────────────────────────────
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const result = await Promise.race([
      model.generateContent([prompt, ...imageParts]),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Analysis timed out. Please try again.")), 30000)
      ),
    ]);

    const text = result.response.text();

    // ── Parse response ──────────────────────────────────────────
    let analysis;
    try {
      analysis = JSON.parse(text.replace(/```json|```/g, "").trim());
    } catch {
      console.error("Gemini returned invalid JSON:", text.slice(0, 500));
      return Response.json(
        { error: "AI returned an invalid response. Please try again." },
        { status: 502 }
      );
    }

    // ── Validate & sanitize ─────────────────────────────────────
    const score = Math.min(100, Math.max(0, Math.round(Number(analysis.score) || 50)));
    const confidence = ["high", "medium", "low"].includes(analysis.confidence)
      ? analysis.confidence
      : "medium";

    return Response.json({
      ok: true,
      score,
      verdict: analysis.verdict || "Analysis Complete",
      confidence,
      summary: analysis.summary || "",
      whatTheyFeel: analysis.whatTheyFeel || "",
      whatThisLooksLike: analysis.whatThisLooksLike || "",
      greenFlags: Array.isArray(analysis.greenFlags) ? analysis.greenFlags.slice(0, 5) : [],
      redFlags: Array.isArray(analysis.redFlags) ? analysis.redFlags.slice(0, 5) : [],
      whyThisIsHappening: analysis.whyThisIsHappening || "",
      keyMoment: analysis.keyMoment || "",
      prediction: analysis.prediction || "",
      advice: analysis.advice || "",
    });
  } catch (err) {
    console.error("Analyze error:", err);
    return Response.json(
      { error: err.message || "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}