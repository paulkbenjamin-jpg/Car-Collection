"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Car } from "@/lib/types";

type SortKey = "year_desc" | "year_asc" | "make" | "mileage_asc" | "mileage_desc";

const SORT_LABELS: Record<SortKey, string> = {
  year_desc: "Year (newest first)",
  year_asc: "Year (oldest first)",
  make: "Make (A–Z)",
  mileage_asc: "Mileage (low to high)",
  mileage_desc: "Mileage (high to low)",
};

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

const selectClass =
  "bg-[var(--color-panel-raised)] border border-[var(--color-line)] rounded px-3 py-2 text-sm text-[var(--color-paper)]";

export default function CollectionList({ cars }: { cars: Car[] }) {
  const [search, setSearch] = useState("");
  const [classification, setClassification] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [make, setMake] = useState("");
  const [sort, setSort] = useState<SortKey>("year_desc");

  const makes = useMemo(
    () => Array.from(new Set(cars.map((c) => c.make).filter(Boolean))).sort(),
    [cars]
  );
  const classifications = useMemo(
    () =>
      Array.from(
        new Set(cars.map((c) => c.classification).filter(Boolean))
      ).sort() as string[],
    [cars]
  );
  const vehicleTypes = useMemo(
    () =>
      Array.from(
        new Set(cars.map((c) => c.vehicle_type).filter(Boolean))
      ).sort() as string[],
    [cars]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = cars.filter((c) => {
      if (classification && c.classification !== classification) return false;
      if (vehicleType && c.vehicle_type !== vehicleType) return false;
      if (make && c.make !== make) return false;
      if (q) {
        const haystack = [c.year, c.make, c.model, c.trim, c.color]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "year_asc":
          return (a.year ?? 0) - (b.year ?? 0);
        case "make":
          return a.make.localeCompare(b.make);
        case "mileage_asc":
          return (a.mileage ?? Infinity) - (b.mileage ?? Infinity);
        case "mileage_desc":
          return (b.mileage ?? -1) - (a.mileage ?? -1);
        case "year_desc":
        default:
          return (b.year ?? 0) - (a.year ?? 0);
      }
    });

    return list;
  }, [cars, search, classification, vehicleType, make, sort]);

  const hasFilters = search || classification || vehicleType || make;

  return (
    <section className="max-w-4xl mx-auto px-6">
      <div className="flex flex-wrap items-center gap-3 py-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search year, make, model…"
          className={`${selectClass} flex-1 min-w-[180px] placeholder:text-[var(--color-paper-dim)]`}
        />

        <select
          value={vehicleType}
          onChange={(e) => setVehicleType(e.target.value)}
          className={selectClass}
        >
          <option value="">All vehicle types</option>
          {vehicleTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select
          value={classification}
          onChange={(e) => setClassification(e.target.value)}
          className={selectClass}
        >
          <option value="">All classifications</option>
          {classifications.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select value={make} onChange={(e) => setMake(e.target.value)} className={selectClass}>
          <option value="">All makes</option>
          {makes.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className={selectClass}
        >
          {Object.entries(SORT_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              Sort: {label}
            </option>
          ))}
        </select>

        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setClassification("");
              setVehicleType("");
              setMake("");
            }}
            className="text-[var(--color-brass)] text-sm hover:text-[var(--color-brass-bright)]"
          >
            Clear filters
          </button>
        )}

        <a
          href="/api/export-pdf"
          className="ml-auto bg-[var(--color-brass)] hover:bg-[var(--color-brass-bright)] text-[var(--color-ink)] text-sm font-medium rounded px-4 py-2 transition-colors whitespace-nowrap"
        >
          Export PDF
        </a>
      </div>

      <div className="brass-rule" />

      {filtered.length === 0 && (
        <p className="text-[var(--color-paper-dim)] py-16 text-center">
          {cars.length === 0 ? "No cars catalogued yet." : "No cars match those filters."}
        </p>
      )}

      {filtered.map((car) => (
        <Link
          key={car.id}
          href={`/car/${car.id}`}
          className="group flex items-center gap-5 py-6 border-b border-[var(--color-line)] hover:bg-[var(--color-panel)] transition-colors -mx-3 px-3 rounded"
        >
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
                <span className="text-[var(--color-paper-dim)]"> · {car.trim}</span>
              ) : null}
            </h2>
            <p className="text-[var(--color-paper-dim)] text-sm mt-0.5 truncate">
              {[car.vehicle_type, car.classification, car.color].filter(Boolean).join(" · ") ||
                "—"}
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
  );
}
