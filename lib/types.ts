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
  notes: string | null;
  photos: string[];
  created_at: string;
};

export type CarInput = Omit<Car, "id" | "created_at">;
