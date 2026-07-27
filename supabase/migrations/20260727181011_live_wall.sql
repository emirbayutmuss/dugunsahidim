-- Faz B: Canlı Fotoğraf Duvarı — events.live_wall_* + organizer_id
-- live_wall_token, slug'dan ayrı ve daha yüksek entropili bir erişim kontrolü:
-- mekanda bir TV'de fiziksel olarak açık kalacağı için tahmin edilemez olmalı.

alter table public.events
  add column live_wall_enabled boolean not null default false,
  add column live_wall_token text unique,
  add column organizer_id uuid null; -- hiçbir arayüzde kullanılmıyor, ileriye dönük zemin

create index events_live_wall_token_idx on public.events(live_wall_token) where live_wall_token is not null;
