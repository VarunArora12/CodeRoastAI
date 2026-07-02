import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { ResultsHeader } from "@/components/results-header";
import { ResultsView } from "./results-view";

export default async function ResultsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/results");
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#050608] text-zinc-100">
      <div className="pointer-events-none fixed inset-0 surface-grid opacity-60" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(180deg,rgba(139,92,246,0.12),transparent_32%),linear-gradient(100deg,rgba(244,114,182,0.08),transparent_36%,rgba(34,211,238,0.08))]" />

      <ResultsHeader />

      <section className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <ResultsView />
      </section>
    </main>
  );
}
