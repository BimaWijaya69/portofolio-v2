"use client";

import { useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/home";

  useEffect(() => {
    if (status !== "authenticated") return;

    if (session?.user?.role === "admin") {
      router.replace("/dashboard");
      return;
    }

    router.replace(callbackUrl);
  }, [status, session, router, callbackUrl]);

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <section className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950/70 p-8 backdrop-blur">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Login untuk akses dashboard admin dan kelola project portfolio.
        </p>

        <div className="mt-8 space-y-3">
          <button
            onClick={() => signIn("google", { callbackUrl })}
            disabled={status === "loading"}
            className="w-full rounded-xl bg-lime-400 px-4 py-3 font-semibold text-black transition hover:bg-lime-300 disabled:opacity-50"
          >
            Continue with Google
          </button>

          {status === "authenticated" && (
            <button
              onClick={() => signOut({ callbackUrl: "/home" })}
              className="w-full rounded-xl border border-white/20 px-4 py-3 font-medium transition hover:bg-white/10"
            >
              Logout
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
