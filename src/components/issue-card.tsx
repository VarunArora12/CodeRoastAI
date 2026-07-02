"use client";

import { motion } from "framer-motion";

import {
  categoryAccent,
  severityStyles,
  type AnalysisIssue,
} from "@/lib/analysis";

type IssueCardProps = {
  issue: AnalysisIssue;
  index: number;
};

export function IssueCard({ issue, index }: IssueCardProps) {
  const severity = severityStyles[issue.severity];
  const accent = categoryAccent[issue.category];

  const accentStyles = {
    red: "border-red-400/15 bg-red-400/[0.06]",
    amber: "border-amber-400/15 bg-amber-400/[0.06]",
    violet: "border-violet-400/15 bg-violet-400/[0.06]",
    cyan: "border-cyan-400/15 bg-cyan-400/[0.06]",
  };

  return (
    <motion.article
      className={`rounded-md border p-4 ${accentStyles[accent]}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      whileHover={{ y: -2, borderColor: "rgba(255,255,255,0.18)" }}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-md border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${severity.badge}`}
        >
          {issue.severity}
        </span>
        {issue.lineNumber !== null ? (
          <span className="rounded-md border border-white/10 bg-white/[0.06] px-2 py-0.5 font-mono text-[11px] text-zinc-300">
            L{issue.lineNumber}
          </span>
        ) : null}
        <span className="rounded-md border border-violet-300/20 bg-violet-400/10 px-2 py-0.5 text-[11px] text-violet-100">
          {issue.category}
        </span>
      </div>
      <h3 className="mt-3 text-sm font-medium text-white">{issue.title}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{issue.explanation}</p>
    </motion.article>
  );
}
