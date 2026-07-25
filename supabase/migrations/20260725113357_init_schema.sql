-- Düğün Şahidim — başlangıç şeması
-- events, uploads, upload_rate_limits tabloları + RLS + storage bucket

create extension if not exists pgcrypto;
create extension if not exists pg_cron;

-- ============ EVENTS ============
create table public.events (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  event_date date,
  slug text not null unique check (slug ~ '^[a-z0-9_-]{8,32}$'),
  status text not null default 'active' check (status in ('active','paused','closed')),
  max_uploads integer not null default 1000,
  max_storage_bytes bigint not null default 5368709120, -- 5 GB
  created_at timestamptz not null default now()
);
create index events_owner_id_idx on public.events(owner_id);
alter table public.events enable row level security;

create policy events_owner_select on public.events
  for select to authenticated using (auth.uid() = owner_id);
create policy events_owner_insert on public.events
  for insert to authenticated with check (auth.uid() = owner_id);
create policy events_owner_update on public.events
  for update to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy events_owner_delete on public.events
  for delete to authenticated using (auth.uid() = owner_id);
-- anon için hiç policy yok -> RLS default deny (events tablosuna anon asla direkt erişemez)

-- ============ UPLOADS ============
create table public.uploads (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  guest_name text check (char_length(guest_name) <= 80),
  file_path text not null unique,
  file_type text not null check (file_type in ('image','video')),
  mime_type text not null,
  declared_file_size bigint not null check (declared_file_size > 0),
  verified_file_size bigint,
  status text not null default 'pending' check (status in ('pending','processing','ready','rejected')),
  created_at timestamptz not null default now()
);
create index uploads_event_created_idx on public.uploads(event_id, created_at desc);
alter table public.uploads enable row level security;

create policy uploads_owner_select on public.uploads
  for select to authenticated
  using (exists (select 1 from public.events e where e.id = uploads.event_id and e.owner_id = auth.uid()));
create policy uploads_owner_delete on public.uploads
  for delete to authenticated
  using (exists (select 1 from public.events e where e.id = uploads.event_id and e.owner_id = auth.uid()));
-- insert/update policy yok -> sadece service_role (Edge Functions) yazabilir

-- ============ RATE LIMIT ============
create table public.upload_rate_limits (
  event_id uuid not null references public.events(id) on delete cascade,
  ip_hash text not null,
  window_start timestamptz not null,
  upload_count integer not null default 0,
  primary key (event_id, ip_hash, window_start)
);
create index upload_rate_limits_window_idx on public.upload_rate_limits(window_start);
alter table public.upload_rate_limits enable row level security;
-- policy yok -> sadece service_role

select cron.schedule('cleanup-rate-limits', '0 * * * *',
  $$ delete from public.upload_rate_limits where window_start < now() - interval '1 hour'; $$);

-- ============ STORAGE ============
insert into storage.buckets (id, name, public, file_size_limit)
values ('event-media', 'event-media', false, 104857600); -- 100MB donanım tavanı

create policy storage_owner_select on storage.objects
  for select to authenticated
  using (
    bucket_id = 'event-media'
    and exists (
      select 1 from public.events e
      where e.id::text = (storage.foldername(name))[1] and e.owner_id = auth.uid()
    )
  );
-- anon için insert/select/list policy yok -> dizin taraması bile imkansız
