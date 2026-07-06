-- =========================================================================
-- BLOOMING HEARTS — Supabase database setup
-- Run this whole file once in: Supabase Dashboard → SQL Editor → New query
-- =========================================================================

-- 1) PROFILES
-- Extra info about each user (name, phone) that Supabase Auth doesn't store.
-- One row per user, same id as auth.users.id.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  phone text,
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);


-- 2) CART ITEMS
create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id int not null,
  qty int not null default 1,
  unique (user_id, product_id)
);

alter table public.cart_items enable row level security;

create policy "Users manage own cart"
  on public.cart_items for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- 3) WISHLIST ITEMS
create table if not exists public.wishlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id int not null,
  unique (user_id, product_id)
);

alter table public.wishlist_items enable row level security;

create policy "Users manage own wishlist"
  on public.wishlist_items for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- 4) ADDRESSES
create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  label text default 'Home',
  name text,
  phone text,
  address text,
  city text,
  pincode text,
  created_at timestamptz default now()
);

alter table public.addresses enable row level security;

create policy "Users manage own addresses"
  on public.addresses for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- 5) ORDERS
create table if not exists public.orders (
  id text primary key,              -- e.g. "BH-482913"
  user_id uuid references auth.users(id) on delete cascade not null,
  items jsonb not null,             -- [{name, qty, price}, ...]
  total numeric not null,
  address text,
  date text,
  status text default 'Confirmed',
  slot text,
  payment text,
  created_at timestamptz default now()
);

alter table public.orders enable row level security;

create policy "Users manage own orders"
  on public.orders for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- 6) AUTO-CREATE A PROFILE ROW WHENEVER SOMEONE SIGNS UP
-- Supabase Auth stores the user in the hidden `auth.users` table.
-- This trigger copies the "name" they signed up with into our own
-- `profiles` table automatically, so we don't have to do it in JS.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, phone)
  values (new.id, new.raw_user_meta_data->>'name', '');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
