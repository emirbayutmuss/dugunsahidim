-- QR görüntülenme / yükleme dönüşüm oranı analytics.
-- Basit, anonim visitor_id (tarayıcı localStorage'da üretilen rastgele UUID) —
-- kişisel veri değil, sadece aynı ziyaretçinin tekrar sayılmasını önlemek için.

alter table public.uploads
  add column visitor_id uuid;

create table public.event_page_views (
  event_id uuid not null references public.events(id) on delete cascade,
  visitor_id uuid not null,
  viewed_at timestamptz not null default now(),
  primary key (event_id, visitor_id)
);
create index event_page_views_event_id_idx on public.event_page_views(event_id);
alter table public.event_page_views enable row level security;

create policy event_page_views_owner_select on public.event_page_views
  for select to authenticated
  using (
    exists (
      select 1 from public.events e
      where e.id = event_page_views.event_id and e.owner_id = auth.uid()
    )
  );
-- insert/update/delete policy yok -> sadece service_role (resolve-event Edge Function) yazabilir
