-- Basit iletişim formu için tablo. Herkese açık, girişsiz bir insert yüzeyi
-- olduğu için (misafir yükleme hattındaki gibi) varsayılan-red RLS + dar bir
-- insert policy kullanılıyor. Depolama maliyeti yok (sadece metin), bu yüzden
-- upload hattındaki gibi ayrı bir rate-limit tablosuna gerek görülmedi.

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 254),
  message text not null check (char_length(message) between 1 and 2000),
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

create policy contact_messages_anon_insert on public.contact_messages
  for insert to anon, authenticated
  with check (true);
-- select/update/delete policy yok -> sadece service_role (Supabase Dashboard'dan) okuyabilir
