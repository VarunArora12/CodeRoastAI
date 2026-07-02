"use client";

import Link from "next/link";
import { Braces } from "lucide-react";

import { Button } from "@/components/ui/button";

export function SiteNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/45 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-md border border-white/10 bg-white text-black shadow-[0_0_36px_rgba(255,255,255,0.16)] transition-transform group-hover:scale-105">
            <Braces className="size-5" />
          </span>
          <span className="text-sm font-semibold text-white sm:text-base">
            CodeRoast AI
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="secondary">
            <Link href="/analyze">Analyze</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
