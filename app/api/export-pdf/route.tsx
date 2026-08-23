import { NextResponse } from "next/server";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import { getSupabasePublic } from "@/lib/supabase/client";
import type { Car } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// react-pdf can only decode these formats; anything else (webp, heic, ...)
// is silently dropped rather than crashing the whole export.
const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

// Fetches each photo server-side and inlines it as a data URI, with a
// timeout and format check, so one slow or unsupported photo can't take
// down the whole PDF (react-pdf has no per-image error fallback).
async function toDataUri(url: string): Promise<string | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") || "";
    if (!SUPPORTED_IMAGE_TYPES.includes(contentType.toLowerCase())) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    return `data:${contentType};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

// Cap how many photos per car we embed, to keep export time and file size
// reasonable for a full-collection PDF.
async function resolvePhotos(photos: string[]): Promise<string[]> {
  const capped = photos.slice(0, 3);
  const resolved = await Promise.all(capped.map(toDataUri));
  return resolved.filter((u): u is string => u !== null);
}

// Auction-catalog-style PDF: a cover page followed by one full spec sheet
// per car. Printed on a cream/ink palette (rather than the site's dark
// theme) since this is meant to be read, and potentially printed, offline.
const styles = StyleSheet.create({
  cover: {
    backgroundColor: "#f7f3ea",
    padding: 64,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  coverTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 40,
    color: "#1a1814",
    letterSpacing: 1,
  },
  coverSubtitle: {
    fontFamily: "Helvetica",
    fontSize: 11,
    color: "#8a6a3d",
    letterSpacing: 3,
    marginTop: 14,
    textTransform: "uppercase",
  },
  coverMeta: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#6b6255",
    marginTop: 60,
  },
  page: {
    backgroundColor: "#f7f3ea",
    padding: 40,
    fontFamily: "Helvetica",
  },
  topRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  lot: {
    fontFamily: "Courier-Bold",
    fontSize: 10,
    color: "#8a6a3d",
    letterSpacing: 1,
  },
  brand: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#8a8072",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  title: {
    fontFamily: "Helvetica-Bold",
    fontSize: 24,
    color: "#1a1814",
  },
  subtitle: {
    fontFamily: "Helvetica",
    fontSize: 11,
    color: "#6b6255",
    marginTop: 4,
  },
  classificationPill: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    color: "#f7f3ea",
    backgroundColor: "#8a6a3d",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 2,
    letterSpacing: 1,
    textTransform: "uppercase",
    alignSelf: "flex-start",
    marginTop: 10,
  },
  mainPhoto: {
    width: "100%",
    height: 260,
    objectFit: "cover",
    marginTop: 16,
    borderRadius: 2,
  },
  thumbRow: {
    display: "flex",
    flexDirection: "row",
    gap: 6,
    marginTop: 6,
  },
  thumb: {
    width: 96,
    height: 64,
    objectFit: "cover",
    borderRadius: 2,
  },
  specGrid: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#d8d0bd",
  },
  specItem: {
    width: "50%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingRight: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#d8d0bd",
  },
  specLabel: {
    fontSize: 9,
    color: "#8a8072",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  specValue: {
    fontSize: 10,
    fontFamily: "Courier",
    color: "#1a1814",
  },
  notesLabel: {
    fontSize: 9,
    color: "#8a8072",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 20,
    marginBottom: 6,
  },
  notes: {
    fontSize: 10,
    color: "#3a352c",
    lineHeight: 1.5,
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 40,
    right: 40,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: "#8a8072",
  },
});

function Spec({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <View style={styles.specItem}>
      <Text style={styles.specLabel}>{label}</Text>
      <Text style={styles.specValue}>{value}</Text>
    </View>
  );
}

function CarPage({ car, index }: { car: Car; index: number }) {
  const lot = String(car.lot_number ?? index + 1).padStart(2, "0");
  const [mainPhoto, ...restPhotos] = car.photos ?? [];

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.topRow}>
        <Text style={styles.lot}>LOT {lot}</Text>
        <Text style={styles.brand}>The Dicksonian</Text>
      </View>

      <Text style={styles.title}>
        {car.year} {car.make} {car.model}
      </Text>
      {car.trim && <Text style={styles.subtitle}>{car.trim}</Text>}
      {car.classification && (
        <Text style={styles.classificationPill}>{car.classification}</Text>
      )}

      {mainPhoto && (
        // eslint-disable-next-line jsx-a11y/alt-text
        <Image src={mainPhoto} style={styles.mainPhoto} />
      )}
      {restPhotos.length > 0 && (
        <View style={styles.thumbRow}>
          {restPhotos.map((url, i) => (
            // eslint-disable-next-line jsx-a11y/alt-text
            <Image key={i} src={url} style={styles.thumb} />
          ))}
        </View>
      )}

      <View style={styles.specGrid}>
        <Spec label="Mileage" value={car.mileage != null ? `${car.mileage.toLocaleString()} mi` : null} />
        <Spec label="Color" value={car.color} />
        <Spec label="Engine" value={car.engine} />
        <Spec label="Transmission" value={car.transmission} />
        <Spec label="VIN" value={car.vin} />
        <Spec label="Classification" value={car.classification} />
      </View>

      {car.notes && (
        <>
          <Text style={styles.notesLabel}>Notes</Text>
          <Text style={styles.notes}>{car.notes}</Text>
        </>
      )}

      <View style={styles.footer} fixed>
        <Text>Dick Michael · (415) 608-4701</Text>
        <Text
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        />
      </View>
    </Page>
  );
}

export async function GET() {
  const supabase = getSupabasePublic();
  const { data: cars, error } = await supabase
    .from("cars")
    .select("*")
    .order("lot_number", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const list = (cars ?? []) as Car[];
  const generatedOn = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  try {
    const withResolvedPhotos = await Promise.all(
      list.map(async (car) => ({
        ...car,
        photos: await resolvePhotos(car.photos ?? []),
      }))
    );

    const buffer = await renderToBuffer(
      <Document title="The Dicksonian — Full Collection">
        <Page size="A4" style={styles.cover}>
          <Text style={styles.coverTitle}>The Dicksonian</Text>
          <Text style={styles.coverSubtitle}>Full Collection · Auction Listing</Text>
          <Text style={styles.coverMeta}>
            {list.length} motorcar{list.length === 1 ? "" : "s"} · Generated {generatedOn}
          </Text>
        </Page>

        {withResolvedPhotos.map((car, i) => (
          <CarPage key={car.id} car={car} index={i} />
        ))}
      </Document>
    );

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="dicksonian-collection.pdf"',
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
