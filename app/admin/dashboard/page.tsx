"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Car } from "@/lib/types";

export default function AdminDashboardPage() {
  const [cars, setCars] = useState<Car[] | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/cars")
      .then((r) => r.json())
      .then((json) => setCars(json.cars ?? []));
  }, []);

  async function handleSignOut() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/admin");
  }

  return (
    <main className="min-h-screen bg-[var(--color-ink)]">
      <header className="max-w-4xl mx-auto px-6 pt-12 pb-6 flex items-center justify-between">
        <div>
          <p className="lot-number text-xs uppercase tracking-[0.25em]">Admin</p>
          <h1 className="font-[family-name:var(--font-display)] italic text-3xl mt-2 text-[var(--color-paper)]">
            Manage the collection
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-[var(--color-paper-dim)] hover:text-[var(--color-paper)]">
            View public page
          </Link>
          <button
            onClick={handleSignOut}
            className="text-sm text-[var(--color-rust)] hover:underline"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 mb-6">
        <Link
          href="/admin/dashboard/new"
          className="inline-block bg-[var(--color-brass)] hover:bg-[var(--color-brass-bright)] text-[var(--color-ink)] font-medium rounded px-5 py-2.5 transition-colors"
        >
          + Add a car
        </Link>
      </div>

      <div className="brass-rule max-w-4xl mx-auto" />

      <section className="max-w-4xl mx-auto px-6">
        {cars === null && (
          <p className="text-[var(--color-paper-dim)] py-10">Loading…</p>
        )}
        {cars?.length === 0 && (
          <p className="text-[var(--color-paper-dim)] py-10">
            No cars yet. Add the first one above.
          </p>
        )}
        {cars?.map((car, i) => (
          <Link
            key={car.id}
            href={`/admin/dashboard/${car.id}`}
            className="flex items-center gap-4 py-5 border-b border-[var(--color-line)] hover:bg-[var(--color-panel)] transition-colors -mx-3 px-3 rounded"
          >
            <span className="lot-number text-sm w-8 shrink-0">
              {String(car.lot_number ?? i + 1).padStart(2, "0")}
            </span>
            <div className="w-16 h-11 shrink-0 rounded overflow-hidden bg-[var(--color-panel-raised)] border border-[var(--color-line)]">
              {car.photos?.[0] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={car.photos[0]} alt="" className="w-full h-full object-cover" />
              )}
            </div>
            <span className="font-[family-name:var(--font-display)] text-[var(--color-paper)]">
              {car.year} {car.make} {car.model}
            </span>
            <span className="ml-auto text-[var(--color-brass)] text-sm">Edit →</span>
          </Link>
        ))}
      </section>
    </main>
  );
}
