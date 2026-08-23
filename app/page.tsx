import { getSupabasePublic } from "@/lib/supabase/client";
import type { Car } from "@/lib/types";
import Logo from "@/components/Logo";
import CollectionList from "@/components/CollectionList";

export const dynamic = "force-dynamic";

export default async function CollectionPage() {
  const supabase = getSupabasePublic();
  const { data: cars } = await supabase
    .from("cars")
    .select("*")
    .order("created_at", { ascending: true });

  const list = (cars ?? []) as Car[];

  return (
    <main className="min-h-screen bg-[var(--color-ink)]">
      <header className="max-w-4xl mx-auto px-6 pt-16 pb-10 text-center">
        <Logo />
        <p className="lot-number text-xs uppercase tracking-[0.25em] mt-4">
          Private Inventory
        </p>
      </header>

      <CollectionList cars={list} />
    </main>
  );
}
