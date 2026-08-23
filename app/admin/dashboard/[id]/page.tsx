import CarForm from "@/components/CarForm";
import { getSupabasePublic } from "@/lib/supabase/client";
import { notFound } from "next/navigation";
import type { Car } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditCarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = getSupabasePublic();
  const { data: car } = await supabase.from("cars").select("*").eq("id", id).single();

  if (!car) return notFound();

  return (
    <main className="min-h-screen bg-[var(--color-ink)]">
      <div className="max-w-2xl mx-auto px-6 pt-12 pb-16">
        <p className="lot-number text-xs uppercase tracking-[0.25em]">Admin</p>
        <h1 className="font-[family-name:var(--font-display)] italic text-3xl mt-2 mb-8 text-[var(--color-paper)]">
          Edit car
        </h1>
        <CarForm car={car as Car} />
      </div>
    </main>
  );
}
