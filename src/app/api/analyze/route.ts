import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getGeminiModel } from "@/lib/gemini";
import { parseAnalysisResponse } from "@/lib/analysis";

export const runtime = "nodejs";

const AnalyzeRequestSchema = z.object({
  code: z.string().trim().min(1, "Code is required."),
  language: z.string().trim().min(1, "Language is required."),
});

function jsonError(message: string, status: number, code?: string) {
  return NextResponse.json({ error: message, code }, { status });
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return jsonError("Invalid JSON payload.", 400);
  }

  const requestResult = AnalyzeRequestSchema.safeParse(payload);

  if (!requestResult.success) {
    return jsonError(requestResult.error.issues[0]?.message ?? "Invalid request.", 400);
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return jsonError(
      "Missing GEMINI_API_KEY in .env.local",
      503,
      "MISSING_GEMINI_API_KEY"
    );
  }

  const ai = new GoogleGenAI({ apiKey });

  const { code, language } = requestResult.data;

  const prompt = `
You are CodeRoast AI, a senior software engineer performing a realistic code review.

Analyze this ${language} code with the rigor of a staff engineer in a production codebase review.

Return ONLY valid JSON. No markdown fences, no commentary outside JSON.

SCORING RULES (critical — follow exactly):
- Score like a senior engineer: fair, calibrated, and explainable.
- Start from 100 and deduct based on impact.
- Minor style/readability nits: deduct 1–3 points each.
- Maintainability concerns: deduct 3–8 points each.
- Performance issues: deduct 5–12 points each.
- Runtime bugs / logic errors: deduct 10–25 points each.
- Security vulnerabilities: deduct 15–35 points each (Critical security: up to 40).
- NEVER give overallScore below 20 unless the code is almost completely unusable (won't compile/run, empty, or dangerously broken throughout).
- Clean, working code with minor suggestions should score 75–95.
- Solid production-quality code should score 85–98.
- breakdown.overallScore must reflect the holistic review (not a simple average of sub-scores).
- Each breakdown sub-score (security, readability, maintainability, performance, reliability) is 0–100 for that dimension alone.

ISSUE RULES:
- Every issue MUST include: title, explanation, severity, lineNumber, category.
- severity: exactly one of "Critical", "High", "Medium", "Low".
- category: exactly one of "Bug", "Security", "Performance", "Maintainability", "Readability", "Best Practice".
- Do NOT use "Reliability" or any other category label.
- lineNumber: positive integer line in the submitted code, or null if not identifiable.
- explanation: 1–3 sentences describing impact and why it matters.
- Include ALL meaningful findings. Do not invent issues that aren't present.

OPTIMIZATION:
- optimizedCode: improved version of the submitted code (same language).
- optimizedCodeReason: 2–4 sentences explaining WHY the optimized code is better (what problems it fixes and how).

The JSON MUST match this schema exactly:

{
  "breakdown": {
    "overallScore": number,
    "security": number,
    "readability": number,
    "maintainability": number,
    "performance": number,
    "reliability": number
  },
  "timeComplexity": string,
  "spaceComplexity": string,
  "issues": [
    {
      "title": string,
      "explanation": string,
      "severity": "Critical" | "High" | "Medium" | "Low",
      "lineNumber": number | null,
      "category": "Bug" | "Security" | "Performance" | "Maintainability" | "Readability" | "Best Practice"
    }
  ],
  "optimizedCode": string,
  "optimizedCodeReason": string,
  "summary": string
}

Code to analyze:

${code}
`;

  try {
    const result = await ai.models.generateContent({
      model: getGeminiModel(),
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = result.text;

    if (!text) {
      return jsonError(
        "Empty response from Gemini.",
        500,
        "EMPTY_RESPONSE"
      );
    }

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);
    const analysis = parseAnalysisResponse(parsed);

    return NextResponse.json(analysis);
  } catch (err) {
    console.error(err);

    if (err instanceof z.ZodError) {
      return jsonError(
        "Gemini returned invalid JSON.",
        500,
        "INVALID_JSON"
      );
    }

    if (err instanceof SyntaxError) {
      return jsonError(
        "Gemini returned malformed JSON.",
        500,
        "INVALID_JSON"
      );
    }

    return jsonError(
      "Gemini analysis failed.",
      500,
      "GEMINI_ERROR"
    );
  }
}
