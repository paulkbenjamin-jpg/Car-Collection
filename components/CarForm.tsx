"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CLASSIFICATIONS, type Car, type CarInput } from "@/lib/types";

const emptyCar: CarInput = {
  lot_number: null,
  year: null,
  make: "",
  model: "",
  trim: "",
  color: "",
  vin: "",
  mileage: null,
  engine: "",
  transmission: "",
  classification: null,
  notes: "",
  photos: [],
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block mb-4">
      <span className="block text-xs uppercase tracking-[0.15em] text-[var(--color-paper-dim)] mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full bg-[var(--color-panel-raised)] border border-[var(--color-line)] rounded px-3 py-2.5 text-[var(--color-paper)] placeholder:text-[var(--color-paper-dim)]";

export default function CarForm({ car }: { car?: Car }) {
  const router = useRouter();
  const [form, setForm] = useState<CarInput>(
    car
      ? {
          lot_number: car.lot_number,
          year: car.year,
          make: car.make,
          model: car.model,
          trim: car.trim,
          color: car.color,
          vin: car.vin,
          mileage: car.mileage,
          engine: car.engine,
          transmission: car.transmission,
          classification: car.classification,
          notes: car.notes,
          photos: car.photos,
        }
      : emptyCar
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof CarInput>(key: K, value: CarInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handlePhotoUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const data = new FormData();
        data.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: data });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Upload failed");
        uploaded.push(json.url);
      }
      update("photos", [...form.photos, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function removePhoto(url: string) {
    update(
      "photos",
      form.photos.filter((p) => p !== url)
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const url = car ? `/api/cars/${car.id}` : "/api/cars";
    const method = car ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      router.push("/admin/dashboard");
      router.refresh();
    } else {
      const json = await res.json();
      setError(json.error || "Failed to save");
    }
  }

  async function handleDelete() {
    if (!car) return;
    if (!confirm(`Delete ${car.year} ${car.make} ${car.model}? This can't be undone.`)) return;
    const res = await fetch(`/api/cars/${car.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/dashboard");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <div className="grid grid-cols-2 gap-x-4">
        <Field label="Lot #">
          <input
            type="number"
            className={inputClass}
            value={form.lot_number ?? ""}
            onChange={(e) =>
              update("lot_number", e.target.value ? Number(e.target.value) : null)
            }
          />
        </Field>
        <Field label="Year">
          <input
            type="number"
            className={inputClass}
            value={form.year ?? ""}
            onChange={(e) => update("year", e.target.value ? Number(e.target.value) : null)}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-x-4">
        <Field label="Make">
          <input
            required
            className={inputClass}
            value={form.make}
            onChange={(e) => update("make", e.target.value)}
          />
        </Field>
        <Field label="Model">
          <input
            className={inputClass}
            value={form.model ?? ""}
            onChange={(e) => update("model", e.target.value)}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-x-4">
        <Field label="Trim">
          <input
            className={inputClass}
            value={form.trim ?? ""}
            onChange={(e) => update("trim", e.target.value)}
          />
        </Field>
        <Field label="Color">
          <input
            className={inputClass}
            value={form.color ?? ""}
            onChange={(e) => update("color", e.target.value)}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-x-4">
        <Field label="Mileage">
          <input
            type="number"
            className={inputClass}
            value={form.mileage ?? ""}
            onChange={(e) => update("mileage", e.target.value ? Number(e.target.value) : null)}
          />
        </Field>
        <Field label="VIN">
          <input
            className={inputClass}
            value={form.vin ?? ""}
            onChange={(e) => update("vin", e.target.value)}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-x-4">
        <Field label="Engine">
          <input
            className={inputClass}
            value={form.engine ?? ""}
            onChange={(e) => update("engine", e.target.value)}
          />
        </Field>
        <Field label="Transmission">
          <input
            className={inputClass}
            value={form.transmission ?? ""}
            onChange={(e) => update("transmission", e.target.value)}
          />
        </Field>
      </div>

      <Field label="Vehicle Classification">
        <select
          className={inputClass}
          value={form.classification ?? ""}
          onChange={(e) =>
            update(
              "classification",
              e.target.value ? (e.target.value as CarInput["classification"]) : null
            )
          }
        >
          <option value="">—</option>
          {CLASSIFICATIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Notes">
        <textarea
          rows={4}
          className={inputClass}
          value={form.notes ?? ""}
          onChange={(e) => update("notes", e.target.value)}
        />
      </Field>

      <Field label="Photos">
        <input
          type="file"
          accept="image/*"
          multiple
          capture="environment"
          onChange={(e) => handlePhotoUpload(e.target.files)}
          className="text-sm text-[var(--color-paper-dim)]"
        />
        {uploading && (
          <p className="text-[var(--color-brass)] text-sm mt-2">Uploading…</p>
        )}
        {form.photos.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mt-3">
            {form.photos.map((url) => (
              <div key={url} className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt=""
                  className="w-full h-20 object-cover rounded border border-[var(--color-line)]"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(url)}
                  className="absolute top-1 right-1 bg-black/70 text-white text-xs w-5 h-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </Field>

      {error && <p className="text-[var(--color-rust)] text-sm mb-4">{error}</p>}

      <div className="flex items-center gap-3 mt-6">
        <button
          type="submit"
          disabled={saving || uploading}
          className="bg-[var(--color-brass)] hover:bg-[var(--color-brass-bright)] text-[var(--color-ink)] font-medium rounded px-5 py-2.5 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : car ? "Save changes" : "Add to collection"}
        </button>
        {car && (
          <button
            type="button"
            onClick={handleDelete}
            className="text-[var(--color-rust)] text-sm hover:underline"
          >
            Delete this car
          </button>
        )}
      </div>
    </form>
  );
}
