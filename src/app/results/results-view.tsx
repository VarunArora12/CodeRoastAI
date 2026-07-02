"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { AnalysisDashboard } from "@/components/analysis-dashboard";
import { EmptyAnalysisState } from "@/components/empty-analysis-state";
import { FadeIn } from "@/components/fade-in";
import { Button } from "@/components/ui/button";
import {
  analysisStorageKey,
  parseStoredAnalysis,
  type StoredAnalysis,
} from "@/lib/analysis";

function ResultsSkeleton() {
  return (
    <div className="flex min-h-[320px] items-center justify-center rounded-md border border-white/10 bg-black/30 p-8">
      <div className="flex items-center gap-3 text-sm text-zinc-400">
        <Loader2 className="size-5 animate-spin text-violet-300" />
        Loading analysis results...
      </div>
    </div>
  );
}

function readStoredAnalysis(): StoredAnalysis | null {
  if (typeof window === "undefined") {
    return null;
  }

  return parseStoredAnalysis(window.localStorage.getItem(analysisStorageKey));
}

export function ResultsView() {
  const [stored, setStored] = useState<StoredAnalysis | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setStored(readStoredAnalysis());
    setIsReady(true);
  }, []);

  if (!isReady) {
    return <ResultsSkeleton />;
  }

  if (!stored) {
    return <EmptyAnalysisState />;
  }

  return (
    <FadeIn>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-300">
            Analysis results
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
            Code review dashboard
          </h1>
        </div>
        <Button asChild className="w-full sm:w-auto" variant="secondary">
          <Link href="/analyze">New analysis</Link>
        </Button>
      </div>
      <AnalysisDashboard analysis={stored.analysis} language={stored.language} />
    </FadeIn>
  );
}
