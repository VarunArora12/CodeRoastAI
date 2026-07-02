import { z } from "zod";

export const IssueSeveritySchema = z.enum([
  "Critical",
  "High",
  "Medium",
  "Low",
]);

export const IssueCategorySchema = z.enum([
  "Bug",
  "Security",
  "Performance",
  "Maintainability",
  "Readability",
  "Best Practice",
]);

export const AnalysisIssueSchema = z.object({
  title: z.string().min(1),
  explanation: z.string().min(1),
  severity: IssueSeveritySchema,
  lineNumber: z.number().int().positive().nullable(),
  category: IssueCategorySchema,
});

export const ScoreBreakdownSchema = z.object({
  overallScore: z.number().min(0).max(100),
  security: z.number().min(0).max(100),
  readability: z.number().min(0).max(100),
  maintainability: z.number().min(0).max(100),
  performance: z.number().min(0).max(100),
  reliability: z.number().min(0).max(100),
});

export const CodeAnalysisSchema = z
  .object({
    breakdown: ScoreBreakdownSchema,
    timeComplexity: z.string(),
    spaceComplexity: z.string(),
    issues: z.array(AnalysisIssueSchema),
    optimizedCode: z.string(),
    optimizedCodeReason: z.string(),
    summary: z.string(),
  })
  .strict();

export type IssueSeverity = z.infer<typeof IssueSeveritySchema>;
export type IssueCategory = z.infer<typeof IssueCategorySchema>;
export type AnalysisIssue = z.infer<typeof AnalysisIssueSchema>;
export type ScoreBreakdown = z.infer<typeof ScoreBreakdownSchema>;
export type CodeAnalysis = z.infer<typeof CodeAnalysisSchema>;

export type AnalyzeErrorResponse = {
  error: string;
  code?: string;
};

export const analysisStorageKey = "coderoast:lastAnalysis";

export const languageExtensions: Record<string, string> = {
  go: "go",
  javascript: "js",
  python: "py",
  rust: "rs",
  typescript: "ts",
};

export const StoredAnalysisSchema = z.object({
  analysis: CodeAnalysisSchema,
  language: z.string(),
  analyzedAt: z.string(),
});

export type StoredAnalysis = z.infer<typeof StoredAnalysisSchema>;

const CATEGORY_VALUES = IssueCategorySchema.options;

const CATEGORY_ALIASES: Record<string, IssueCategory> = {
  bug: "Bug",
  bugs: "Bug",
  reliability: "Bug",
  security: "Security",
  "security issue": "Security",
  performance: "Performance",
  maintainability: "Maintainability",
  "code smell": "Maintainability",
  "code smells": "Maintainability",
  readability: "Readability",
  "best practice": "Best Practice",
  "best practices": "Best Practice",
};

function clampScore(value: unknown, fallback = 70): number {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number.parseFloat(value)
        : Number.NaN;

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(100, Math.max(0, Math.round(parsed)));
}

export function normalizeSeverity(value: unknown): IssueSeverity {
  if (typeof value !== "string") {
    return "Low";
  }

  const normalized = value.trim().toLowerCase();

  if (normalized === "critical") return "Critical";
  if (normalized === "high") return "High";
  if (normalized === "medium") return "Medium";
  if (
    normalized === "low" ||
    normalized === "info" ||
    normalized === "informational"
  ) {
    return "Low";
  }

  return "Low";
}

export function normalizeCategory(value: unknown): IssueCategory {
  if (typeof value !== "string") {
    return "Maintainability";
  }

  const trimmed = value.trim();
  const direct = CATEGORY_VALUES.find(
    (category) => category.toLowerCase() === trimmed.toLowerCase(),
  );

  if (direct) {
    return direct;
  }

  const alias = CATEGORY_ALIASES[trimmed.toLowerCase()];
  if (alias) {
    return alias;
  }

  const lower = trimmed.toLowerCase();
  if (lower.includes("security")) return "Security";
  if (lower.includes("performance")) return "Performance";
  if (lower.includes("readability")) return "Readability";
  if (lower.includes("bug") || lower.includes("reliability")) return "Bug";
  if (lower.includes("best practice")) return "Best Practice";

  return "Maintainability";
}

export function normalizeLineNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed =
    typeof value === "number" ? value : Number.parseInt(String(value), 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return null;
  }

  return Math.floor(parsed);
}

function normalizeIssue(raw: unknown): AnalysisIssue {
  const issue =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};

  const title =
    typeof issue.title === "string" && issue.title.trim()
      ? issue.title.trim()
      : typeof issue.description === "string" && issue.description.trim()
        ? issue.description.trim().slice(0, 120)
        : "Review finding";

  const explanation =
    typeof issue.explanation === "string" && issue.explanation.trim()
      ? issue.explanation.trim()
      : typeof issue.description === "string" && issue.description.trim()
        ? issue.description.trim()
        : "This item was flagged during automated review.";

  return {
    title,
    explanation,
    severity: normalizeSeverity(issue.severity),
    lineNumber: normalizeLineNumber(issue.lineNumber),
    category: normalizeCategory(issue.category),
  };
}

function normalizeBreakdown(raw: unknown): ScoreBreakdown {
  const breakdown =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};

  const overallScore = clampScore(breakdown.overallScore, 70);

  return {
    overallScore,
    security: clampScore(breakdown.security, overallScore),
    readability: clampScore(breakdown.readability, overallScore),
    maintainability: clampScore(breakdown.maintainability, overallScore),
    performance: clampScore(breakdown.performance, overallScore),
    reliability: clampScore(breakdown.reliability, overallScore),
  };
}

function collectLegacyIssues(raw: Record<string, unknown>): AnalysisIssue[] {
  const legacyGroups: Array<{ key: string; category: IssueCategory }> = [
    { key: "bugs", category: "Bug" },
    { key: "securityIssues", category: "Security" },
    { key: "codeSmells", category: "Maintainability" },
    { key: "bestPractices", category: "Best Practice" },
  ];

  const issues: AnalysisIssue[] = [];

  for (const group of legacyGroups) {
    const items = raw[group.key];
    if (!Array.isArray(items)) {
      continue;
    }

    for (const item of items) {
      if (typeof item === "string") {
        issues.push({
          title: item,
          explanation: item,
          severity: group.category === "Security" ? "High" : "Medium",
          lineNumber: null,
          category: group.category,
        });
      } else {
        issues.push(normalizeIssue({ ...item, category: group.category }));
      }
    }
  }

  return issues;
}

export function normalizeRawAnalysis(raw: unknown): unknown {
  if (!raw || typeof raw !== "object") {
    return raw;
  }

  const source = raw as Record<string, unknown>;
  const breakdownSource =
    source.breakdown && typeof source.breakdown === "object"
      ? source.breakdown
      : {
          overallScore: source.overallScore,
          security: source.security,
          readability: source.readability,
          maintainability: source.maintainability,
          performance: source.performance,
          reliability: source.reliability,
        };

  const breakdown = normalizeBreakdown(breakdownSource);
  const rawIssues = Array.isArray(source.issues) ? source.issues : [];
  const issues =
    rawIssues.length > 0
      ? rawIssues.map(normalizeIssue)
      : collectLegacyIssues(source);

  return {
    breakdown,
    timeComplexity:
      typeof source.timeComplexity === "string" && source.timeComplexity.trim()
        ? source.timeComplexity.trim()
        : "Unknown",
    spaceComplexity:
      typeof source.spaceComplexity === "string" && source.spaceComplexity.trim()
        ? source.spaceComplexity.trim()
        : "Unknown",
    issues,
    optimizedCode:
      typeof source.optimizedCode === "string" ? source.optimizedCode : "",
    optimizedCodeReason:
      typeof source.optimizedCodeReason === "string" &&
      source.optimizedCodeReason.trim()
        ? source.optimizedCodeReason.trim()
        : "The optimized version improves correctness, clarity, and maintainability.",
    summary:
      typeof source.summary === "string" && source.summary.trim()
        ? source.summary.trim()
        : "Analysis completed.",
  };
}

export function parseAnalysisResponse(raw: unknown): CodeAnalysis {
  return CodeAnalysisSchema.parse(normalizeRawAnalysis(raw));
}

export function parseStoredAnalysis(raw: string | null): StoredAnalysis | null {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as {
      analysis?: unknown;
      language?: string;
      analyzedAt?: string;
    };

    if (!parsed.analysis || !parsed.language || !parsed.analyzedAt) {
      return null;
    }

    return StoredAnalysisSchema.parse({
      analysis: parseAnalysisResponse(parsed.analysis),
      language: parsed.language,
      analyzedAt: parsed.analyzedAt,
    });
  } catch {
    return null;
  }
}

export function getIssuesByCategory(
  issues: AnalysisIssue[],
  category: IssueCategory,
): AnalysisIssue[] {
  return issues.filter((issue) => issue.category === category);
}

export function getOverallScore(analysis: CodeAnalysis): number {
  return analysis.breakdown.overallScore;
}

export const severityStyles: Record<
  IssueSeverity,
  { badge: string; accent: "red" | "amber" | "violet" | "cyan" }
> = {
  Critical: {
    badge: "border-red-400/30 bg-red-400/15 text-red-100",
    accent: "red",
  },
  High: {
    badge: "border-orange-400/30 bg-orange-400/15 text-orange-100",
    accent: "red",
  },
  Medium: {
    badge: "border-amber-400/30 bg-amber-400/15 text-amber-100",
    accent: "amber",
  },
  Low: {
    badge: "border-zinc-400/30 bg-zinc-400/10 text-zinc-300",
    accent: "violet",
  },
};

export const categoryAccent: Record<
  IssueCategory,
  "red" | "amber" | "violet" | "cyan"
> = {
  Bug: "red",
  Security: "amber",
  Performance: "cyan",
  Maintainability: "violet",
  Readability: "violet",
  "Best Practice": "cyan",
};

export function saveAnalysisToStorage(
  analysis: CodeAnalysis,
  language: string,
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      analysisStorageKey,
      JSON.stringify({
        analysis,
        language,
        analyzedAt: new Date().toISOString(),
      }),
    );
  } catch {
    // Ignore quota/private mode errors so the UI can still finish.
  }
}
