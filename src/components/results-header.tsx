"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { ArrowLeft, Braces } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ResultsHeader() {
  return (
    <header className="relative border-b border-white/10 bg-black/40 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="size-4" />
          <span className="flex size-7 items-center justify-center rounded-md border border-white/10 bg-white text-black">
            <Braces className="size-4" />
          </span>
          CodeRoast AI
        </Link>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="secondary">
            <Link href="/analyze">New analysis</Link>
          </Button>
          <Button
            size="sm"
            type="button"
            variant="ghost"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Log out
          </Button>
        </div>
      </div>
    </header>
  );
}
