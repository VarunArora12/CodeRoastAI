export type ScoreTheme = {
  stroke: string;
  text: string;
  glow: string;
  label: string;
};

export function getScoreTheme(score: number): ScoreTheme {
  if (score >= 80) {
    return {
      stroke: "#34d399",
      text: "text-emerald-300",
      glow: "rgba(52,211,153,0.35)",
      label: "Strong",
    };
  }

  if (score >= 60) {
    return {
      stroke: "#fbbf24",
      text: "text-amber-300",
      glow: "rgba(251,191,36,0.35)",
      label: "Decent",
    };
  }

  if (score >= 40) {
    return {
      stroke: "#fb923c",
      text: "text-orange-300",
      glow: "rgba(251,146,60,0.35)",
      label: "Needs work",
    };
  }

  return {
    stroke: "#f87171",
    text: "text-red-300",
    glow: "rgba(248,113,113,0.35)",
    label: "Critical",
  };
}
