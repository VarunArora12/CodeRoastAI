"use client";

import {
  BookOpen,
  Bug,
  Clock3,
  Flame,
  HardDrive,
  ShieldAlert,
  Sparkles,
  Wind,
  Zap,
} from "lucide-react";

import { CopyCodeBlock } from "@/components/copy-code-block";
import { FadeIn } from "@/components/fade-in";
import { IssueCard } from "@/components/issue-card";
import { RoastScoreRing } from "@/components/roast-score-ring";
import { ScoreBreakdownPanel } from "@/components/score-breakdown-panel";
import {
  getIssuesByCategory,
  getOverallScore,
  languageExtensions,
  type CodeAnalysis,
  type IssueCategory,
} from "@/lib/analysis";
import { getScoreTheme } from "@/lib/score";

type AnalysisDashboardProps = {
  analysis: CodeAnalysis;
  language: string;
};

function SectionHeader({
  icon: Icon,
  title,
  delay = 0,
}: {
  icon: typeof Flame;
  title: string;
  delay?: number;
}) {
  return (
    <FadeIn delay={delay} className="mb-4 flex items-center gap-2">
      <Icon className="size-4 text-violet-300" />
      <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-300">
        {title}
      </h2>
    </FadeIn>
  );
}

function EmptySectionMessage({ message }: { message: string }) {
  return (
    <div className="rounded-md border border-dashed border-white/10 bg-white/[0.03] px-4 py-6 text-center text-sm text-zinc-500">
      {message}
    </div>
  );
}

function IssueSection({
  category,
  delay,
  emptyMessage,
  icon,
  title,
  issues,
}: {
  category: IssueCategory;
  delay: number;
  emptyMessage: string;
  icon: typeof Flame;
  title: string;
  issues: CodeAnalysis["issues"];
}) {
  const filtered = getIssuesByCategory(issues, category);

  return (
    <FadeIn delay={delay}>
      <section className="glass-panel rounded-md p-5 sm:p-6">
        <SectionHeader delay={delay} icon={icon} title={title} />
        {filtered.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {filtered.map((issue, index) => (
              <IssueCard index={index} issue={issue} key={`${issue.title}-${index}`} />
            ))}
          </div>
        ) : (
          <EmptySectionMessage message={emptyMessage} />
        )}
      </section>
    </FadeIn>
  );
}

export function AnalysisDashboard({ analysis, language }: AnalysisDashboardProps) {
  const overallScore = getOverallScore(analysis);
  const scoreTheme = getScoreTheme(overallScore);
  const extension = languageExtensions[language] ?? language;
  const performanceIssues = getIssuesByCategory(analysis.issues, "Performance");

  return (
    <div className="space-y-6">
      <FadeIn>
        <section className="glass-panel rounded-md p-6 sm:p-8">
          <SectionHeader icon={Flame} title="Roast Score" />
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-10">
            <RoastScoreRing score={overallScore} size={176} />
            <div className="text-center sm:text-left">
              <p className={`text-sm font-medium ${scoreTheme.text}`}>
                {scoreTheme.label}
              </p>
              <p className="mt-2 max-w-md text-sm leading-6 text-zinc-400">
                {analysis.summary}
              </p>
            </div>
          </div>
        </section>
      </FadeIn>

      <ScoreBreakdownPanel breakdown={analysis.breakdown} />

      <div className="grid gap-4 sm:grid-cols-2">
        <FadeIn delay={0.08}>
          <section className="glass-panel h-full rounded-md p-5 transition-transform duration-300 hover:-translate-y-0.5">
            <SectionHeader icon={Clock3} title="Performance" delay={0.08} />
            <div className="grid gap-3">
              <div className="rounded-md border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">
                  Time Complexity
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {analysis.timeComplexity}
                </p>
              </div>
              <div className="rounded-md border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">
                  Space Complexity
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {analysis.spaceComplexity}
                </p>
              </div>
            </div>
            {performanceIssues.length > 0 ? (
              <div className="mt-4 grid gap-3">
                {performanceIssues.map((issue, index) => (
                  <IssueCard index={index} issue={issue} key={`${issue.title}-${index}`} />
                ))}
              </div>
            ) : null}
          </section>
        </FadeIn>

        <FadeIn delay={0.1}>
          <section className="glass-panel h-full rounded-md p-5 transition-transform duration-300 hover:-translate-y-0.5">
            <SectionHeader icon={Sparkles} title="AI Summary" delay={0.1} />
            <p className="rounded-md border border-white/10 bg-white/[0.04] p-4 text-sm leading-7 text-zinc-300">
              {analysis.summary}
            </p>
          </section>
        </FadeIn>
      </div>

      <IssueSection
        category="Bug"
        delay={0.12}
        emptyMessage="No bugs detected."
        icon={Bug}
        issues={analysis.issues}
        title="Bug Detection"
      />

      <IssueSection
        category="Security"
        delay={0.14}
        emptyMessage="No security issues found."
        icon={ShieldAlert}
        issues={analysis.issues}
        title="Security Issues"
      />

      <IssueSection
        category="Maintainability"
        delay={0.16}
        emptyMessage="No code smells detected."
        icon={Wind}
        issues={analysis.issues}
        title="Code Smells"
      />

      <IssueSection
        category="Readability"
        delay={0.17}
        emptyMessage="No readability issues found."
        icon={BookOpen}
        issues={analysis.issues}
        title="Readability"
      />

      <IssueSection
        category="Best Practice"
        delay={0.18}
        emptyMessage="No best practice suggestions."
        icon={HardDrive}
        issues={analysis.issues}
        title="Best Practices"
      />

      <FadeIn delay={0.2}>
        <section className="glass-panel rounded-md p-5 sm:p-6">
          <SectionHeader icon={Zap} title="Optimized Code" delay={0.2} />
          <div className="mb-4 rounded-md border border-white/10 bg-white/[0.04] p-4">
            <h3 className="text-sm font-medium text-white">Why this change?</h3>
            <p className="mt-2 text-sm leading-7 text-zinc-400">
              {analysis.optimizedCodeReason}
            </p>
          </div>
          <CopyCodeBlock
            code={analysis.optimizedCode}
            filename={`optimized-code.${extension}`}
          />
        </section>
      </FadeIn>
    </div>
  );
}
