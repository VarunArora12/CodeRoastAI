"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { CircleAlert, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/analyze";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result || result.error) {
        setError("Invalid email or password. Please try again.");
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("Unable to sign in right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="glass-panel rounded-md p-6 sm:p-8" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-zinc-300">
            Email
          </label>
          <Input
            autoComplete="email"
            disabled={isLoading}
            id="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
            type="email"
            value={email}
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-zinc-300">
            Password
          </label>
          <Input
            autoComplete="current-password"
            disabled={isLoading}
            id="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            required
            type="password"
            value={password}
          />
        </div>
      </div>

      {error ? (
        <div
          className="mt-4 flex gap-3 rounded-md border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-6 text-red-100"
          role="alert"
        >
          <CircleAlert className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      <Button className="mt-6 w-full" disabled={isLoading} type="submit">
        {isLoading ? <Loader2 className="animate-spin" /> : null}
        {isLoading ? "Signing in..." : "Log in"}
      </Button>

      <p className="mt-4 text-center text-sm text-zinc-500">
        Don&apos;t have an account?{" "}
        <Link className="text-zinc-200 transition-colors hover:text-white" href="/signup">
          Sign up
        </Link>
      </p>
    </form>
  );
}
