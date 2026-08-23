import Link from "next/link";
import { getSupabasePublic } from "@/lib/supabase/client";
import type { Car } from "@/lib/types";
import Logo from "@/components/Logo";

export const dynamic = "force-dynamic";

function formatOdometer(mileage: number | null) {
  const digits = String(mileage ?? 0).padStart(6, "0").split("");
  return (
    <span className="odometer">
      {digits.map((d, i) => (
        <span key={i}>{d}</span>
      ))}
    </span>
  );
}

export default async function CollectionPage() {
  const supabase = getSupabasePublic();
  const { data: cars } = await supabase
    .from("cars")
    .select("*")
    .order("lot_number", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: true });

  const list = (cars ?? []) as Car[];

  return (
    <main className="min-h-screen bg-[var(--color-ink)]">
      <header className="max-w-4xl mx-auto px-6 pt-16 pb-10">
        <Logo />
        <p className="lot-number text-xs uppercase tracking-[0.25em] mt-4">
          Private Inventory
        </p>
        <p className="text-[var(--color-paper-dim)] mt-3 text-sm max-w-md">
          {list.length} motorcar{list.length === 1 ? "" : "s"} catalogued
          below, each with full specification, mileage, and condition
          photography.
        </p>
      </header>

      <div className="brass-rule max-w-4xl mx-auto" />

      <section className="max-w-4xl mx-auto px-6">
        {list.length === 0 && (
          <p className="text-[var(--color-paper-dim)] py-16 text-center">
            No cars catalogued yet.
          </p>
        )}

        {list.map((car, i) => (
          <Link
            key={car.id}
            href={`/car/${car.id}`}
            className="group flex items-center gap-5 py-6 border-b border-[var(--color-line)] hover:bg-[var(--color-panel)] transition-colors -mx-3 px-3 rounded"
          >
            <span className="lot-number text-sm w-10 shrink-0">
              {String(car.lot_number ?? i + 1).padStart(2, "0")}
            </span>

            <div className="w-20 h-14 shrink-0 rounded overflow-hidden bg-[var(--color-panel-raised)] border border-[var(--color-line)]">
              {car.photos?.[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={car.photos[0]}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="font-[family-name:var(--font-display)] text-lg md:text-xl text-[var(--color-paper)] truncate">
                {car.year} {car.make} {car.model}
                {car.trim ? (
                  <span className="text-[var(--color-paper-dim)]">
                    {" "}
                    · {car.trim}
                  </span>
                ) : null}
              </h2>
              <p className="text-[var(--color-paper-dim)] text-sm mt-0.5 truncate">
                {car.color ?? "—"}
              </p>
            </div>

            <div className="text-right shrink-0 hidden sm:block">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-paper-dim)] mb-1">
                Miles
              </p>
              {formatOdometer(car.mileage)}
            </div>

            <span className="text-[var(--color-brass)] group-hover:translate-x-1 transition-transform hidden sm:inline">
              →
            </span>
          </Link>
        ))}
      </section>

      <footer className="max-w-4xl mx-auto px-6 py-16 text-center">
        <p className="text-[var(--color-paper-dim)] text-xs">
          Shared for review purposes.
        </p>
      </footer>
    </main>
  );
}
