import { Flame } from "lucide-react";

import { AnalyzeHeader } from "@/components/analyze-header";
import { AnalyzeForm } from "./analyze-form";

const checks = ["Bug detection", "Complexity", "Security", "Optimization"];

export default function AnalyzePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050608] text-zinc-100">
      <div className="pointer-events-none fixed inset-0 surface-grid opacity-60" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(180deg,rgba(34,211,238,0.1),transparent_30%),linear-gradient(100deg,rgba(139,92,246,0.12),transparent_42%)]" />

      <AnalyzeHeader />

      <section className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <div className="animate-float-in mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.06] px-3 py-2 text-sm font-medium text-zinc-200 backdrop-blur-xl">
              <Flame className="size-4 text-orange-300" />
              Analyzer
            </div>
            <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Paste code for review.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
              Submit your snippet for an AI-powered review with scores, findings,
              and optimized code.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:min-w-[420px]">
            {checks.map((check) => (
              <div
                key={check}
                className="glass-panel rounded-md px-3 py-3 text-xs text-zinc-300"
              >
                {check}
              </div>
            ))}
          </div>
        </div>

        <AnalyzeForm />
      </section>
    </main>
  );
}
