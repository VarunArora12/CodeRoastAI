import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft, Braces } from "lucide-react";

import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050608] text-zinc-100">
      <div className="pointer-events-none fixed inset-0 surface-grid opacity-60" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(180deg,rgba(139,92,246,0.12),transparent_32%),linear-gradient(100deg,rgba(34,211,238,0.08),transparent_36%)]" />

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
        </div>
      </header>

      <section className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-4 py-10 sm:px-6">
        <div className="w-full">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">Log in</h1>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Sign in to analyze code with CodeRoast AI.
            </p>
          </div>
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
