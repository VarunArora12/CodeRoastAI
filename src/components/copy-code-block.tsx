"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

import { CodeBlock } from "@/components/code-block";
import { Button } from "@/components/ui/button";

type CopyCodeBlockProps = {
  code: string;
  filename?: string;
};

export function CopyCodeBlock({ code, filename }: CopyCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <motion.div
      className="overflow-hidden rounded-md border border-white/10 bg-black/45"
      whileHover={{ borderColor: "rgba(255,255,255,0.18)" }}
    >
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <p className="truncate font-mono text-xs text-zinc-500">
          {filename ?? "optimized-code"}
        </p>
        <Button
          aria-label={copied ? "Copied" : "Copy code"}
          className="h-8 px-3 text-xs"
          onClick={handleCopy}
          size="sm"
          type="button"
          variant="secondary"
        >
          {copied ? <Check /> : <Copy />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <CodeBlock code={code} />
    </motion.div>
  );
}
