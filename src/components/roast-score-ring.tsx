"use client";

import { motion } from "framer-motion";

import { getScoreTheme } from "@/lib/score";

type RoastScoreRingProps = {
  score: number;
  size?: number;
};

export function RoastScoreRing({ score, size = 160 }: RoastScoreRingProps) {
  const theme = getScoreTheme(score);
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <div
        className="absolute inset-0 rounded-full blur-2xl"
        style={{ backgroundColor: theme.glow }}
      />
      <svg
        aria-hidden="true"
        className="-rotate-90"
        height={size}
        width={size}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          animate={{ strokeDashoffset: offset }}
          cx={size / 2}
          cy={size / 2}
          fill="none"
          initial={{ strokeDashoffset: circumference }}
          r={radius}
          stroke={theme.stroke}
          strokeDasharray={circumference}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-4xl font-semibold tabular-nums ${theme.text}`}>
          {score}
        </span>
        <span className="mt-1 text-xs uppercase tracking-[0.18em] text-zinc-500">
          / 100
        </span>
      </div>
    </div>
  );
}
