-- ============================================================================
-- Royal Prime Logistics — database schema
-- Run this in the Supabase SQL editor (or `supabase db push`) before setting
-- NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY in the app.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
do $$ begin
  create type user_role as enum ('admin', 'customer');
exception when duplicate_object then null; end $$;

do $$ begin
  create type shipment_status as enum (
    'pending', 'picked_up', 'in_transit', 'customs',
    'out_for_delivery', 'delivered', 'delayed', 'exception'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type package_type as enum (
    'document', 'parcel', 'pallet', 'freight', 'fragile', 'perishable'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type shipping_service as enum (
    'express_international', 'standard_international', 'cargo_freight',
    'ecommerce', 'business_logistics', 'door_to_door'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type support_status as enum ('open', 'in_progress', 'resolved', 'closed');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- users — profile mirror of auth.users, and the only place role is stored
-- ---------------------------------------------------------------------------
create table if not exists public.users (
  id         uuid primary key references auth.users (id) on delete cascade,
  name       text        not null,
  email      text        not null unique,
  phone      text,
  role       user_role   not null default 'customer',
  created_at timestamptz not null default now()
);

create index if not exists users_role_idx  on public.users (role);
create index if not exists users_email_idx on public.users (lower(email));

-- ---------------------------------------------------------------------------
-- shipments
-- ---------------------------------------------------------------------------
create table if not exists public.shipments (
  id                   uuid primary key default gen_random_uuid(),
  tracking_number      text            not null unique,
  sender_name          text            not null,
  sender_email         text,
  sender_phone         text,
  receiver_name        text            not null,
  receiver_email       text,
  receiver_phone       text,
  origin_country       text            not null,
  origin_city          text            not null,
  destination_country  text            not null,
  destination_city     text            not null,
  package_type         package_type    not null default 'parcel',
  weight               numeric(10, 2)  not null check (weight > 0),
  packages             integer         not null default 1 check (packages > 0),
  shipping_service     shipping_service not null default 'express_international',
  status               shipment_status not null default 'pending',
  current_location     text,
  latitude             double precision check (latitude between -90 and 90),
  longitude            double precision check (longitude between -180 and 180),
  estimated_delivery   timestamptz,
  created_at           timestamptz     not null default now(),
  updated_at           timestamptz     not null default now()
);

-- Tracking lookups are the hottest read path on the whole site.
create unique index if not exists shipments_tracking_number_idx
  on public.shipments (upper(tracking_number));
create index if not exists shipments_status_idx       on public.shipments (status);
create index if not exists shipments_created_at_idx   on public.shipments (created_at desc);
create index if not exists shipments_receiver_email_idx on public.shipments (lower(receiver_email));
create index if not exists shipments_sender_email_idx   on public.shipments (lower(sender_email));
create index if not exists shipments_route_idx
  on public.shipments (destination_country, destination_city);

-- ---------------------------------------------------------------------------
-- tracking_events
-- ---------------------------------------------------------------------------
create table if not exists public.tracking_events (
  id          uuid primary key default gen_random_uuid(),
  shipment_id uuid            not null references public.shipments (id) on delete cascade,
  status      shipment_status not null,
  location    text            not null,
  latitude    double precision check (latitude between -90 and 90),
  longitude   double precision check (longitude between -180 and 180),
  description text            not null,
  event_date  timestamptz     not null default now(),
  created_at  timestamptz     not null default now()
);

create index if not exists tracking_events_shipment_idx
  on public.tracking_events (shipment_id, event_date desc);
create index if not exists tracking_events_date_idx
  on public.tracking_events (event_date desc);

-- ---------------------------------------------------------------------------
-- locations
-- ---------------------------------------------------------------------------
create table if not exists public.locations (
  id                 uuid primary key default gen_random_uuid(),
  country            text             not null,
  city               text             not null,
  town               text,
  latitude           double precision not null,
  longitude          double precision not null,
  address            text             not null,
  available_services shipping_service[] not null default '{}',
  created_at         timestamptz      not null default now(),
  unique (country, city, address)
);

create index if not exists locations_country_idx on public.locations (country);
create index if not exists locations_city_idx    on public.locations (lower(city));

-- ---------------------------------------------------------------------------
-- support_requests
-- ---------------------------------------------------------------------------
create table if not exists public.support_requests (
  id              uuid primary key default gen_random_uuid(),
  name            text           not null,
  email           text           not null,
  phone           text,
  tracking_number text,
  subject         text           not null,
  message         text           not null,
  status          support_status not null default 'open',
  created_at      timestamptz    not null default now()
);

create index if not exists support_requests_status_idx on public.support_requests (status);
create index if not exists support_requests_created_idx
  on public.support_requests (created_at desc);

-- ---------------------------------------------------------------------------
-- updated_at maintenance
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists shipments_touch_updated_at on public.shipments;
create trigger shipments_touch_updated_at
  before update on public.shipments
  for each row execute function public.touch_updated_at();

-- New auth users get a customer profile automatically. Role is never taken
-- from client-supplied metadata.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, name, email, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data ->> 'phone',
    'customer'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.users            enable row level security;
alter table public.shipments        enable row level security;
alter table public.tracking_events  enable row level security;
alter table public.locations        enable row level security;
alter table public.support_requests enable row level security;

-- `security definer` so the policy can read public.users without recursing
-- through the users policies themselves.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.users u
    where u.id = auth.uid() and u.role = 'admin'
  );
$$;

-- users -----------------------------------------------------------------
drop policy if exists "users read own profile" on public.users;
create policy "users read own profile" on public.users
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists "users update own profile" on public.users;
create policy "users update own profile" on public.users
  for update using (auth.uid() = id) with check (auth.uid() = id and role = 'customer');

drop policy if exists "admins manage users" on public.users;
create policy "admins manage users" on public.users
  for all using (public.is_admin()) with check (public.is_admin());

-- shipments -------------------------------------------------------------
-- Public tracking is served by the Next.js server using the service-role key,
-- which bypasses RLS and strips contact emails before responding. So RLS here
-- does NOT need a public read rule — and must not have one, or anyone holding
-- the anon key could read every sender and receiver email address directly.
--
-- Through the anon key a signed-in customer sees only their own shipments.
drop policy if exists "public may read shipments for tracking" on public.shipments;

drop policy if exists "customers read own shipments" on public.shipments;
create policy "customers read own shipments" on public.shipments
  for select using (
    public.is_admin()
    or lower(sender_email) = lower(auth.jwt() ->> 'email')
    or lower(receiver_email) = lower(auth.jwt() ->> 'email')
  );

drop policy if exists "admins write shipments" on public.shipments;
create policy "admins write shipments" on public.shipments
  for all using (public.is_admin()) with check (public.is_admin());

-- tracking_events -------------------------------------------------------
drop policy if exists "public may read tracking events" on public.tracking_events;

drop policy if exists "customers read own tracking events" on public.tracking_events;
create policy "customers read own tracking events" on public.tracking_events
  for select using (
    public.is_admin()
    or exists (
      select 1
      from public.shipments s
      where s.id = tracking_events.shipment_id
        and (
          lower(s.sender_email) = lower(auth.jwt() ->> 'email')
          or lower(s.receiver_email) = lower(auth.jwt() ->> 'email')
        )
    )
  );

drop policy if exists "admins write tracking events" on public.tracking_events;
create policy "admins write tracking events" on public.tracking_events
  for all using (public.is_admin()) with check (public.is_admin());

-- locations -------------------------------------------------------------
drop policy if exists "public may read locations" on public.locations;
create policy "public may read locations" on public.locations
  for select using (true);

drop policy if exists "admins write locations" on public.locations;
create policy "admins write locations" on public.locations
  for all using (public.is_admin()) with check (public.is_admin());

-- support_requests ------------------------------------------------------
-- Anyone may open a request; only admins may read or change them.
drop policy if exists "anyone may open a support request" on public.support_requests;
create policy "anyone may open a support request" on public.support_requests
  for insert with check (true);

drop policy if exists "admins read support requests" on public.support_requests;
create policy "admins read support requests" on public.support_requests
  for select using (public.is_admin());

drop policy if exists "admins update support requests" on public.support_requests;
create policy "admins update support requests" on public.support_requests
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins delete support requests" on public.support_requests;
create policy "admins delete support requests" on public.support_requests
  for delete using (public.is_admin());
