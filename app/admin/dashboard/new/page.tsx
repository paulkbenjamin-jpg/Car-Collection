import CarForm from "@/components/CarForm";

export default function NewCarPage() {
  return (
    <main className="min-h-screen bg-[var(--color-ink)]">
      <div className="max-w-2xl mx-auto px-6 pt-12 pb-16">
        <p className="lot-number text-xs uppercase tracking-[0.25em]">Admin</p>
        <h1 className="font-[family-name:var(--font-display)] italic text-3xl mt-2 mb-8 text-[var(--color-paper)]">
          Add a car
        </h1>
        <CarForm />
      </div>
    </main>
  );
}
