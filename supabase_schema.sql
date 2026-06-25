-- =============================================================================
-- ShopWise — Supabase database schema
-- =============================================================================
-- How to run:
--   1. Open your Supabase project dashboard → SQL Editor → New query.
--   2. Paste this entire file and click "Run".
--   3. The table, RLS, and policies will be created automatically.
-- =============================================================================

-- Products table -------------------------------------------------------------
create table if not exists public.products (
  id           text        primary key,
  user_id      uuid        not null default auth.uid() references auth.users(id) on delete cascade,
  name         text        not null,
  canonical_id text        null,
  category     text        not null default '',
  purchase_date text       not null default '',
  expiry_date  text        not null default '',
  quantity     numeric     null,
  unit         text        null,
  image        text        null,
  source       text        not null default 'manual',
  consumed     boolean     not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Migration for tables created before canonical_id existed (safe to re-run)
alter table public.products add column if not exists canonical_id text null;

-- Index for fast per-user queries
create index if not exists products_user_id_idx on public.products(user_id);

-- Row Level Security ---------------------------------------------------------
alter table public.products enable row level security;

-- Policies: authenticated users can only access their own rows.
-- (drop-then-create keeps this script safe to re-run — CREATE POLICY has no IF NOT EXISTS.)
drop policy if exists "Users can select their own products" on public.products;
create policy "Users can select their own products"
  on public.products for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own products" on public.products;
create policy "Users can insert their own products"
  on public.products for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own products" on public.products;
create policy "Users can update their own products"
  on public.products for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own products" on public.products;
create policy "Users can delete their own products"
  on public.products for delete
  using (auth.uid() = user_id);

-- =============================================================================
-- Recipes — shared community catalog (public read, admin-only write)
-- =============================================================================
-- This table is the same for ALL users: everyone reads the same recipe library.
-- Writes are NOT exposed via RLS, so only the dashboard / service-role key can
-- add or edit recipes (run supabase_recipes_seed.sql to populate it).
-- Ingredients/tags/allergens are stored as JSONB to mirror the app's Recipe
-- model 1:1 (filtering and matching happen client-side).
-- =============================================================================
create table if not exists public.recipes (
  id              text        primary key,
  title           text        not null,
  title_en        text        null,                            -- English title (falls back to title)
  ingredients     jsonb       not null default '[]'::jsonb,    -- [{name, canonicalId, quantity, unit}]
  instructions    text        not null default '',
  instructions_en text        null,                            -- English instructions (falls back to instructions)
  prep_time       integer     not null default 0,
  servings        integer     null,                            -- portions the recipe yields
  difficulty      text        not null default 'easy',
  tags            jsonb       not null default '[]'::jsonb,    -- DietTag[]
  allergens       jsonb       not null default '[]'::jsonb,    -- Allergen[]
  cuisine         text        null,                            -- CuisineTag
  image           text        null,
  source_url      text        null,
  origin          text        not null default 'community',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Row Level Security: anyone (even anonymous) may READ; nobody may write via RLS.
alter table public.recipes enable row level security;

-- Migrations for tables created before these columns existed (safe to re-run)
alter table public.recipes add column if not exists cuisine text null;
alter table public.recipes add column if not exists title_en text null;
alter table public.recipes add column if not exists instructions_en text null;
alter table public.recipes add column if not exists servings integer null;

drop policy if exists "Anyone can read recipes" on public.recipes;
create policy "Anyone can read recipes"
  on public.recipes for select
  using (true);

-- =============================================================================
-- LGPD — right to erasure: let a signed-in user delete their OWN account + data
-- =============================================================================
-- The app calls `supabase.rpc('delete_my_account')`. It runs as SECURITY DEFINER
-- (so it can remove the auth.users row), but only ever acts on auth.uid() — a
-- user can only erase themselves. Products are removed first, then the user.
-- Safe to re-run (create or replace).
-- =============================================================================
create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'not authenticated';
  end if;
  delete from public.products where user_id = uid;
  delete from auth.users where id = uid;
end;
$$;

-- Only authenticated users may call it; never anon/public.
revoke all on function public.delete_my_account() from public;
revoke all on function public.delete_my_account() from anon;
grant execute on function public.delete_my_account() to authenticated;
