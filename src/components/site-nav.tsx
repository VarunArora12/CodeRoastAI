"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { ArrowRight, Braces, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type SiteNavProps = {
  initialAuthenticated?: boolean;
};

export function SiteNav({ initialAuthenticated = false }: SiteNavProps) {
  const { status } = useSession();
  const isAuthenticated =
    status === "authenticated" || (status === "loading" && initialAuthenticated);
  const isLoading = status === "loading" && !initialAuthenticated;

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
          {isLoading ? (
            <Button disabled size="sm" variant="secondary">
              <Loader2 className="animate-spin" />
            </Button>
          ) : isAuthenticated ? (
            <>
              <Button asChild size="sm" variant="secondary">
                <Link href="/analyze">Analyze</Link>
              </Button>
              <Button
                size="sm"
                type="button"
                variant="ghost"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button asChild size="sm" variant="secondary">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">
                  Sign up
                  <ArrowRight />
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
