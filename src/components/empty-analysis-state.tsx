"use client";

import { SearchCode } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

export function EmptyAnalysisState() {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel mx-auto max-w-xl rounded-md px-6 py-12 text-center sm:px-10 sm:py-14"
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.05]">
        <SearchCode className="size-6 text-violet-300" />
      </div>
      <h2 className="mt-6 text-2xl font-semibold text-white">No analysis yet</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-zinc-400">
        Paste your code and run an AI review to see results.
      </p>
      <Button asChild className="mt-8" size="lg">
        <Link href="/analyze">Analyze Code</Link>
      </Button>
    </motion.div>
  );
}
