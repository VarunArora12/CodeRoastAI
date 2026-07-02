const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";

export function getGeminiModel(): string {
  const raw = process.env.GEMINI_MODEL?.trim();

  if (!raw) {
    return DEFAULT_GEMINI_MODEL;
  }

  // Guard against malformed .env lines where another key was appended.
  const cleaned = raw.split(/(?=AUTH_|DATABASE_|POSTGRES_|#|\s)/)[0].trim();

  if (/^gemini[-\w.]+$/i.test(cleaned)) {
    return cleaned;
  }

  return DEFAULT_GEMINI_MODEL;
}
