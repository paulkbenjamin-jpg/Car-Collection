"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      setError("Incorrect password.");
    }
  }

  return (
    <main className="min-h-screen bg-[var(--color-ink)] flex items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-[var(--color-panel)] border border-[var(--color-line)] rounded-lg p-8"
      >
        <Logo size="sm" />
        <p className="lot-number text-xs uppercase tracking-[0.25em] mt-4">
          Admin
        </p>
        <h1 className="font-[family-name:var(--font-display)] italic text-2xl mt-2 mb-6 text-[var(--color-paper)]">
          Sign in to edit
        </h1>

        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full bg-[var(--color-panel-raised)] border border-[var(--color-line)] rounded px-4 py-3 text-[var(--color-paper)] placeholder:text-[var(--color-paper-dim)] mb-4"
        />

        {error && <p className="text-[var(--color-rust)] text-sm mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--color-brass)] hover:bg-[var(--color-brass-bright)] text-[var(--color-ink)] font-medium rounded px-4 py-3 transition-colors disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
