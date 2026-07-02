"use client";

import { motion } from "framer-motion";

import { FadeIn } from "@/components/fade-in";
import { type ScoreBreakdown } from "@/lib/analysis";
import { getScoreTheme } from "@/lib/score";

type ScoreBreakdownPanelProps = {
  breakdown: ScoreBreakdown;
  delay?: number;
};

const breakdownLabels: Array<{ key: keyof ScoreBreakdown; label: string }> = [
  { key: "overallScore", label: "Overall Score" },
  { key: "security", label: "Security" },
  { key: "readability", label: "Readability" },
  { key: "maintainability", label: "Maintainability" },
  { key: "performance", label: "Performance" },
  { key: "reliability", label: "Reliability" },
];

export function ScoreBreakdownPanel({ breakdown, delay = 0.04 }: ScoreBreakdownPanelProps) {
  return (
    <FadeIn delay={delay}>
      <section className="glass-panel rounded-md p-5 sm:p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-zinc-300">
          Score Breakdown
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {breakdownLabels.map(({ key, label }, index) => {
            const score = breakdown[key];
            const theme = getScoreTheme(score);

            return (
              <motion.div
                className="rounded-md border border-white/10 bg-white/[0.04] p-4 transition-transform duration-300 hover:-translate-y-0.5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={key}
                transition={{ delay: delay + index * 0.04, duration: 0.35 }}
              >
                <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">
                  {label}
                </p>
                <p className={`mt-2 text-2xl font-semibold tabular-nums ${theme.text}`}>
                  {score}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>
    </FadeIn>
  );
}
