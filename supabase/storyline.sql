-- Italy Family Trip Story Line
-- Run this file in Supabase Dashboard -> SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.trip_stories (
  id uuid primary key default gen_random_uuid(),
  trip_id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  author text not null check (char_length(author) between 1 and 80),
  title text default '',
  body text default '',
  day_key text default '',
  day_title text default '',
  location_name text default '',
  lat double precision,
  lng double precision,
  visit_date timestamptz not null default now(),
  images jsonb not null default '[]'::jsonb,
  image_paths jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists trip_stories_trip_date_idx on public.trip_stories (trip_id, visit_date desc);

alter table public.trip_stories enable row level security;

drop policy if exists "family can read trip stories" on public.trip_stories;
create policy "family can read trip stories"
on public.trip_stories for select
to authenticated
using (true);

drop policy if exists "users create their own stories" on public.trip_stories;
create policy "users create their own stories"
on public.trip_stories for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "users update their own stories" on public.trip_stories;
create policy "users update their own stories"
on public.trip_stories for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "users delete their own stories" on public.trip_stories;
create policy "users delete their own stories"
on public.trip_stories for delete
to authenticated
using (auth.uid() = user_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('trip-story-images', 'trip-story-images', true, 10485760, array['image/jpeg','image/png','image/webp','image/heic','image/heif'])
on conflict (id) do update set public = true, file_size_limit = 10485760;

drop policy if exists "public reads story images" on storage.objects;
create policy "public reads story images"
on storage.objects for select
to public
using (bucket_id = 'trip-story-images');

drop policy if exists "users upload story images" on storage.objects;
create policy "users upload story images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'trip-story-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "users delete their story images" on storage.objects;
create policy "users delete their story images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'trip-story-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Enable realtime for the timeline.
do $$
begin
  alter publication supabase_realtime add table public.trip_stories;
exception when duplicate_object then null;
end $$;

-- Shared family app data: budgets, expenses, notes, checklist, parking, ratings, missions and saved phrases.
create table if not exists public.trip_shared_data (
  trip_id text not null,
  data_key text not null,
  value jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now(),
  primary key (trip_id, data_key)
);

alter table public.trip_shared_data enable row level security;
drop policy if exists "family reads shared trip data" on public.trip_shared_data;
create policy "family reads shared trip data" on public.trip_shared_data for select to authenticated using (true);
drop policy if exists "family creates shared trip data" on public.trip_shared_data;
create policy "family creates shared trip data" on public.trip_shared_data for insert to authenticated with check (auth.uid() = updated_by);
drop policy if exists "family updates shared trip data" on public.trip_shared_data;
create policy "family updates shared trip data" on public.trip_shared_data for update to authenticated using (true) with check (auth.uid() = updated_by);
drop policy if exists "family deletes shared trip data" on public.trip_shared_data;
create policy "family deletes shared trip data" on public.trip_shared_data for delete to authenticated using (true);

do $$ begin
  alter publication supabase_realtime add table public.trip_shared_data;
exception when duplicate_object then null; end $$;

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('trip-shared-files','trip-shared-files',true,10485760,array['image/jpeg','image/png','image/webp','image/heic','image/heif'])
on conflict (id) do update set public=true,file_size_limit=10485760;

drop policy if exists "public reads shared trip files" on storage.objects;
create policy "public reads shared trip files" on storage.objects for select to public using (bucket_id='trip-shared-files');
drop policy if exists "family uploads shared trip files" on storage.objects;
create policy "family uploads shared trip files" on storage.objects for insert to authenticated with check (bucket_id='trip-shared-files');
