-- Bible Study App — optional accounts & cloud sync.
--
-- Run this once in your Supabase project's SQL editor (Project → SQL Editor).
-- It creates a single table holding one JSONB blob per signed-in user
-- (notes, highlights, reading progress, settings, last-read position), gated
-- by Row-Level Security so a user can only ever read/write their own row.

create table if not exists public.user_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_state enable row level security;

create policy "own row select" on public.user_state for select using (auth.uid() = user_id);
create policy "own row upsert" on public.user_state for insert with check (auth.uid() = user_id);
create policy "own row update" on public.user_state for update using (auth.uid() = user_id);
