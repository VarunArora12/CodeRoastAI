import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { FadeIn } from "@/components/fade-in";
import { SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050608] text-zinc-100">
      <div className="pointer-events-none fixed inset-0 surface-grid opacity-70" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(180deg,rgba(139,92,246,0.16),transparent_28%),linear-gradient(90deg,rgba(34,211,238,0.08),transparent_34%,rgba(244,114,182,0.07))]" />

      <SiteNav />

      <section className="relative">
        <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <FadeIn className="max-w-3xl">
            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] text-white sm:text-6xl lg:text-7xl">
              Code review UI with a sharper edge.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
              AI-powered code reviews that detect bugs, analyze complexity,
              improve performance, and generate optimized code in seconds.
            </p>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link href="/analyze">
                  Analyze Code
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </FadeIn>

          <FadeIn
            className="glass-panel rounded-md p-3 sm:p-4"
            delay={0.12}
          >
            <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                <span className="size-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="size-2.5 rounded-full bg-[#28c840]" />
              </div>
              <span className="rounded border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-zinc-500">
                review.ts
              </span>
            </div>
            <pre className="min-h-[320px] overflow-hidden rounded-md border border-white/10 bg-black/55 p-4 text-[13px] leading-6 text-zinc-300 shadow-inner shadow-black/40 sm:min-h-[380px] sm:p-5">
              <code>{`async function analyzeSnippet(code: string) {
  const review = await fetch("/api/analyze", {
    method: "POST",
    body: JSON.stringify({ code }),
  })

  return review.json()
}`}</code>
            </pre>
          </FadeIn>
        </div>
      </section>

      <footer className="relative border-t border-white/10 bg-black/20 py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>CodeRoast AI</p>
          <Link href="/analyze" className="transition-colors hover:text-zinc-200">
            Analyze
          </Link>
        </div>
      </footer>
    </main>
  );
}
