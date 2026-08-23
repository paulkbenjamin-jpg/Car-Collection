-- Run this once in your Supabase project's SQL Editor
-- (Dashboard > SQL Editor > New query > paste > Run).

create extension if not exists "pgcrypto";

create table if not exists cars (
  id uuid primary key default gen_random_uuid(),
  lot_number int,
  year int,
  make text not null,
  model text,
  trim text,
  color text,
  vin text,
  mileage int,
  engine text,
  transmission text,
  classification text,
  notes text,
  photos text[] default '{}',
  created_at timestamptz default now()
);

alter table cars enable row level security;

-- Anyone (the public share link, and the admin dashboard) can read.
create policy "Public read access" on cars
  for select using (true);

-- Deliberately no insert/update/delete policy for the anon role.
-- Writes only happen through /api/cars and /api/upload, which use the
-- service role key server-side and therefore bypass RLS entirely.

-- ---- Migration: adding the Vehicle Classification field ----
-- If your `cars` table already existed before this field was added, run
-- this once in the SQL Editor (safe to re-run; no-op if the column exists):
-- alter table cars add column if not exists classification text;

-- ---- Storage ----
-- After running this file, also go to Storage in the Supabase dashboard
-- and create a new bucket named "car-photos" with "Public bucket" turned ON.
-- No storage policies are needed for reads (public bucket) or writes
-- (the service role key bypasses storage RLS too).
