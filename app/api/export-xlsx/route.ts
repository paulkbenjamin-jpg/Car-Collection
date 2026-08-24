import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { getSupabasePublic } from "@/lib/supabase/client";
import type { Car } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = getSupabasePublic();
  const { data: cars, error } = await supabase
    .from("cars")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const list = (cars ?? []) as Car[];

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "The Dicksonian";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Collection");

  sheet.columns = [
    { header: "Year", key: "year", width: 8 },
    { header: "Make", key: "make", width: 16 },
    { header: "Model", key: "model", width: 18 },
    { header: "Trim", key: "trim", width: 16 },
    { header: "Vehicle Type", key: "vehicle_type", width: 14 },
    { header: "Classification", key: "classification", width: 20 },
    { header: "Color", key: "color", width: 14 },
    { header: "Mileage", key: "mileage", width: 10 },
    { header: "Engine", key: "engine", width: 16 },
    { header: "Transmission", key: "transmission", width: 14 },
    { header: "VIN", key: "vin", width: 20 },
    { header: "Notes", key: "notes", width: 40 },
  ];

  sheet.getRow(1).font = { bold: true };
  sheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFEDE6D6" },
  };

  for (const car of list) {
    sheet.addRow({
      year: car.year,
      make: car.make,
      model: car.model,
      trim: car.trim,
      vehicle_type: car.vehicle_type,
      classification: car.classification,
      color: car.color,
      mileage: car.mileage,
      engine: car.engine,
      transmission: car.transmission,
      vin: car.vin,
      notes: car.notes,
    });
  }

  sheet.views = [{ state: "frozen", ySplit: 1 }];
  sheet.autoFilter = { from: "A1", to: "L1" };

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="dicksonian-collection.xlsx"',
    },
  });
}
