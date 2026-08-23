import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { CarInput } from "@/lib/types";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = (await request.json()) as CarInput;
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("cars")
    .update({
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
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ car: data });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("cars").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
