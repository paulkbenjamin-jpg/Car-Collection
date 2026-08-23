import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { getSupabasePublic } from "@/lib/supabase/client";
import type { CarInput } from "@/lib/types";

// Reading the list works for anyone (public collection view + admin
// dashboard both use this), since the cars table allows public SELECT.
export async function GET() {
  const supabase = getSupabasePublic();
  const { data, error } = await supabase
    .from("cars")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ cars: data });
}

// Creating a car requires the admin session cookie (enforced in middleware).
export async function POST(request: NextRequest) {
  const body = (await request.json()) as CarInput;
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("cars")
    .insert({
      year: body.year,
      make: body.make,
      model: body.model,
      trim: body.trim,
      color: body.color,
      vin: body.vin,
      mileage: body.mileage,
      engine: body.engine,
      transmission: body.transmission,
      classification: body.classification,
      vehicle_type: body.vehicle_type,
      notes: body.notes,
      photos: body.photos ?? [],
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ car: data });
}
