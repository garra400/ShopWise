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

-- Index for fast per-user queries
create index if not exists products_user_id_idx on public.products(user_id);

-- Row Level Security ---------------------------------------------------------
alter table public.products enable row level security;

-- Policies: authenticated users can only access their own rows
create policy "Users can select their own products"
  on public.products for select
  using (auth.uid() = user_id);

create policy "Users can insert their own products"
  on public.products for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own products"
  on public.products for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own products"
  on public.products for delete
  using (auth.uid() = user_id);
