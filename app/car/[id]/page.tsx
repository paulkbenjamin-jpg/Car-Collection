import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabasePublic } from "@/lib/supabase/client";
import type { Car } from "@/lib/types";
import Logo from "@/components/Logo";

export const dynamic = "force-dynamic";

function formatOdometer(mileage: number | null) {
  const digits = String(mileage ?? 0).padStart(6, "0").split("");
  return (
    <span className="odometer text-lg">
      {digits.map((d, i) => (
        <span key={i}>{d}</span>
      ))}
    </span>
  );
}

function Spec({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between py-3 border-b border-[var(--color-line)]">
      <span className="text-[var(--color-paper-dim)] text-sm uppercase tracking-[0.15em]">
        {label}
      </span>
      <span className="font-[family-name:var(--font-mono)] text-[var(--color-paper)] text-sm text-right">
        {value}
      </span>
    </div>
  );
}

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = getSupabasePublic();
  const { data: car } = await supabase
    .from("cars")
    .select("*")
    .eq("id", id)
    .single();

  if (!car) return notFound();
  const c = car as Car;

  return (
    <main className="min-h-screen bg-[var(--color-ink)]">
      <div className="max-w-3xl mx-auto px-6 pt-10 flex items-center justify-between">
        <Link
          href="/"
          className="text-[var(--color-brass)] text-sm inline-flex items-center gap-2 hover:text-[var(--color-brass-bright)]"
        >
          ← Back to the collection
        </Link>
        <Logo size="sm" />
      </div>

      <header className="max-w-3xl mx-auto px-6 pt-8 pb-6">
        <p className="lot-number text-xs uppercase tracking-[0.25em]">
          Lot {String(c.lot_number ?? "—").padStart(2, "0")}
        </p>
        <h1 className="font-[family-name:var(--font-display)] italic text-3xl md:text-5xl mt-3 text-[var(--color-paper)]">
          {c.year} {c.make} {c.model}
        </h1>
        {c.trim && (
          <p className="text-[var(--color-paper-dim)] mt-2">{c.trim}</p>
        )}
      </header>

      {c.photos?.length > 0 && (
        <div className="max-w-3xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8">
            {c.photos.map((url, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={url}
                alt={`${c.year} ${c.make} ${c.model} — photo ${i + 1}`}
                className={`w-full object-cover rounded border border-[var(--color-line)] ${
                  i === 0 ? "md:col-span-2 max-h-[420px]" : "max-h-[260px]"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      <section className="max-w-3xl mx-auto px-6 pb-8">
        <div className="bg-[var(--color-panel)] border border-[var(--color-line)] rounded-lg p-6 mb-6 flex items-center justify-between">
          <span className="text-[var(--color-paper-dim)] text-xs uppercase tracking-[0.2em]">
            Odometer
          </span>
          {formatOdometer(c.mileage)}
        </div>

        <div className="brass-rule mb-2" />
        <Spec label="Classification" value={c.classification} />
        <Spec label="Color" value={c.color} />
        <Spec label="Engine" value={c.engine} />
        <Spec label="Transmission" value={c.transmission} />
        <Spec label="VIN" value={c.vin} />

        {c.notes && (
          <div className="mt-8">
            <p className="text-[var(--color-paper-dim)] text-xs uppercase tracking-[0.2em] mb-3">
              Notes
            </p>
            <p className="text-[var(--color-paper)] leading-relaxed whitespace-pre-wrap">
              {c.notes}
            </p>
          </div>
        )}
      </section>

      <footer className="max-w-3xl mx-auto px-6 py-16 text-center">
        <p className="text-[var(--color-paper)] text-sm">Dick Michael</p>
        <p className="text-[var(--color-paper-dim)] text-sm mt-1">(415) 608-4701</p>
        <p className="text-[var(--color-paper-dim)] text-xs mt-6">
          Shared for review purposes.
        </p>
      </footer>
    </main>
  );
}
