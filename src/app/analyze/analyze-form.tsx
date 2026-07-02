"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Braces,
  CircleAlert,
  Loader2,
  Play,
  SearchCode,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  CodeAnalysisSchema,
  saveAnalysisToStorage,
  type AnalyzeErrorResponse,
  languageExtensions,
} from "@/lib/analysis";

const ANALYSIS_TIMEOUT_MS = 120_000;
const DEFAULT_LANGUAGE = "typescript";

function ResultSkeleton() {
  return (
    <motion.section
      animate={{ opacity: 1, y: 0 }}
      aria-label="Analysis loading"
      className="mt-6 rounded-md border border-white/10 bg-black/30 p-5 sm:p-6"
      initial={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.35 }}
    >
      <div className="mb-6 flex items-center gap-3 text-sm text-zinc-400">
        <Loader2 className="size-5 animate-spin text-violet-300" />
        Gemini is reviewing your code...
      </div>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <Skeleton className="mx-auto size-36 rounded-full sm:mx-0" />
        <div className="w-full max-w-xl space-y-3">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            className="rounded-md border border-white/10 bg-white/[0.035] p-4"
            key={index}
          >
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-3 h-4 w-full" />
          </div>
        ))}
      </div>
    </motion.section>
  );
}

function EmptyState() {
  return (
    <section className="mt-6 rounded-md border border-dashed border-white/15 bg-white/[0.025] p-6 text-center sm:p-10">
      <div className="mx-auto flex size-11 items-center justify-center rounded-md border border-white/10 bg-white/[0.05]">
        <SearchCode className="size-5 text-violet-300" />
      </div>
      <h2 className="mt-4 text-base font-medium text-white">
        Analysis results will appear here
      </h2>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-zinc-500">
        Paste a snippet, choose the language, and run analysis to see your
        roast score and findings.
      </p>
    </section>
  );
}

export function AnalyzeForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const lineCount = useMemo(() => Math.max(code.split(/\r?\n/).length, 1), [code]);

  useEffect(() => {
    setCode("");
    setLanguage(DEFAULT_LANGUAGE);
    setError(null);
    setIsLoading(false);
  }, []);

  async function handleAnalyze(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    if (!code.trim()) {
      setError("Paste code before running analysis.");
      return;
    }

    setError(null);
    setIsLoading(true);

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), ANALYSIS_TIMEOUT_MS);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, language }),
        signal: controller.signal,
      });

      let payload: unknown;

      try {
        payload = await response.json();
      } catch {
        setError("The analysis route returned an unreadable response. Please try again.");
        return;
      }

      if (!response.ok) {
        const errorPayload = payload as AnalyzeErrorResponse;
        setError(errorPayload.error ?? "Analysis failed. Please try again.");
        return;
      }

      const parsed = CodeAnalysisSchema.safeParse(payload);

      if (!parsed.success) {
        setError("The analysis response was invalid. Please try again.");
        return;
      }

      saveAnalysisToStorage(parsed.data, language);
      router.push("/results");
    } catch (requestError) {
      if (requestError instanceof DOMException && requestError.name === "AbortError") {
        setError("Analysis timed out. Please try again with a shorter snippet.");
        return;
      }

      setError("Unable to reach the analysis route. Check your connection and try again.");
    } finally {
      window.clearTimeout(timeoutId);
      setIsLoading(false);
    }
  }

  return (
    <form
      aria-busy={isLoading}
      aria-describedby="analyze-status"
      className="glass-panel rounded-md p-4 sm:p-6"
      onSubmit={handleAnalyze}
    >
      <div className="mb-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_auto] lg:items-end">
        <div className="rounded-md border border-white/10 bg-black/30 p-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-md bg-white text-black">
              <Braces className="size-5" />
            </span>
            <div>
              <p className="text-sm font-medium text-white">Code input</p>
              <p className="text-xs text-zinc-500">
                {lineCount} {lineCount === 1 ? "line" : "lines"} ready to review
              </p>
            </div>
          </div>
        </div>
        <div>
          <label
            htmlFor="language"
            className="mb-2 block text-sm font-medium text-zinc-300"
          >
            Language
          </label>
          <Select disabled={isLoading} value={language} onValueChange={setLanguage}>
            <SelectTrigger aria-label="Select language" id="language">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="go">Go</SelectItem>
              <SelectItem value="rust">Rust</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="w-full lg:w-auto" disabled={isLoading} type="submit">
          {isLoading ? <Loader2 className="animate-spin" /> : <Play />}
          {isLoading ? "Analyzing..." : "Analyze"}
        </Button>
      </div>

      <div className="overflow-hidden rounded-md border border-white/10 bg-black/45">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
          <label htmlFor="code" className="text-sm font-medium text-zinc-300">
            editor.{languageExtensions[language] ?? "txt"}
          </label>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            {isLoading ? (
              <span className="inline-flex items-center gap-2 text-violet-200">
                <Loader2 className="size-3.5 animate-spin" />
                Analyzing
              </span>
            ) : (
              <>
                <span className="pulse-line h-1.5 w-16 rounded-full bg-violet-300/60" />
                Ready
              </>
            )}
          </div>
        </div>
        <div className="grid grid-cols-[2.75rem_minmax(0,1fr)] sm:grid-cols-[3rem_minmax(0,1fr)]">
          <div
            aria-hidden="true"
            className="select-none border-r border-white/10 bg-white/[0.025] px-2 py-4 text-right font-mono text-[12px] leading-6 text-zinc-600 sm:px-3 sm:text-sm"
          >
            {Array.from({ length: lineCount }).map((_, index) => (
              <div key={index}>{index + 1}</div>
            ))}
          </div>
          <Textarea
            aria-label="Code to analyze"
            disabled={isLoading}
            id="code"
            className="min-h-[280px] rounded-none border-0 bg-transparent focus:ring-0 sm:min-h-[360px]"
            onChange={(event) => setCode(event.target.value)}
            placeholder="Paste your code here..."
            spellCheck={false}
            value={code}
          />
        </div>
      </div>

      <p aria-live="polite" className="sr-only" id="analyze-status">
        {isLoading
          ? "Analyzing code."
          : error
            ? `Analysis error: ${error}`
            : "Ready to analyze code."}
      </p>

      <AnimatePresence mode="wait">
        {error ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex gap-3 rounded-md border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-6 text-red-100"
            exit={{ opacity: 0, y: -8 }}
            initial={{ opacity: 0, y: 8 }}
            key="error"
            role="alert"
          >
            <CircleAlert className="mt-0.5 size-4 shrink-0" />
            <span>{error}</span>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {isLoading ? <ResultSkeleton /> : <EmptyState />}
    </form>
  );
}
