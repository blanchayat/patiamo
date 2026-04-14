-- PATİAMO Supabase schema

-- Extensions
create extension if not exists pgcrypto;

-- Tables
create table if not exists public.availability (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  time text not null,
  is_available boolean not null default true
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  date date not null,
  time text not null,
  duration text not null,
  area text not null,
  note text,
  allergy_status text,
  allergy_note text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

-- Constraints / indexes
create unique index if not exists availability_unique_slot
  on public.availability(date, time);

create index if not exists availability_date_idx on public.availability(date);
create index if not exists bookings_date_idx on public.bookings(date);
create index if not exists bookings_status_idx on public.bookings(status);

create unique index if not exists bookings_unique_active_slot
  on public.bookings(date, time)
  where status in ('pending','confirmed');

alter table public.bookings
  add constraint bookings_status_check
  check (status in ('pending','confirmed','cancelled'));

alter table public.bookings
  add constraint bookings_duration_check
  check (duration in ('30 dk','60 dk'));

alter table public.bookings
  add constraint bookings_area_check
  check (area in ('Nişantaşı','Bebek','Emirgan'));

alter table public.bookings
  add constraint bookings_allergy_status_check
  check (allergy_status is null or allergy_status in ('none','has'));

-- RLS
alter table public.availability enable row level security;
alter table public.bookings enable row level security;

-- Public read: only available slots
drop policy if exists "public_read_available_slots" on public.availability;
create policy "public_read_available_slots" on public.availability
  for select
  using (is_available = true);

-- Public insert booking requests (pending only)
drop policy if exists "public_create_booking_request" on public.bookings;
create policy "public_create_booking_request" on public.bookings
  for insert
  with check (status = 'pending');

-- Optional: block public reads of bookings (default denied)

-- Functions used by server/admin
create or replace function public.confirm_booking(p_booking_id uuid)
returns void
language plpgsql
security definer
as $$
declare
  v_date date;
  v_time text;
  v_updated integer;
begin
  select b.date, b.time into v_date, v_time
  from public.bookings b
  where b.id = p_booking_id
  for update;

  if not found then
    raise exception 'Booking not found';
  end if;

  update public.availability a
    set is_available = false
    where a.date = v_date and a.time = v_time and a.is_available = true;

  get diagnostics v_updated = row_count;
  if v_updated <> 1 then
    raise exception 'Slot is not available';
  end if;

  update public.bookings
    set status = 'confirmed'
    where id = p_booking_id;
end;
$$;

create or replace function public.cancel_booking(p_booking_id uuid)
returns void
language plpgsql
security definer
as $$
declare
  v_date date;
  v_time text;
begin
  select b.date, b.time into v_date, v_time
  from public.bookings b
  where b.id = p_booking_id
  for update;

  if not found then
    raise exception 'Booking not found';
  end if;

  update public.bookings
    set status = 'cancelled'
    where id = p_booking_id;

  update public.availability a
    set is_available = true
    where a.date = v_date and a.time = v_time;
end;
$$;

revoke all on function public.confirm_booking(uuid) from public;
revoke all on function public.cancel_booking(uuid) from public;
