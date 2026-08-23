export const CLASSIFICATIONS = [
  "Unrestored (Original)",
  "Restored",
  "Custom (Modified)",
  "Restomod",
  "Survivor",
] as const;

export type Classification = (typeof CLASSIFICATIONS)[number];

export const VEHICLE_TYPES = ["Car", "Truck", "Motorcycle"] as const;

export type VehicleType = (typeof VEHICLE_TYPES)[number];

export type Car = {
  id: string;
  lot_number: number | null;
  year: number | null;
  make: string;
  model: string | null;
  trim: string | null;
  color: string | null;
  vin: string | null;
  mileage: number | null;
  engine: string | null;
  transmission: string | null;
  classification: Classification | null;
  vehicle_type: VehicleType | null;
  notes: string | null;
  photos: string[];
  created_at: string;
};

export type CarInput = Omit<Car, "id" | "created_at">;
