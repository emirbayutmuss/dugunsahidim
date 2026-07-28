-- Faz C: Galeriyi e-postayla gönder — events.gallery_download_* + rate-limited RPC
-- live_wall_token ile aynı desen: owner client'ta nanoid token üretir, RPC sahiplik +
-- cooldown kontrolü yapıp events satırına damgalar. Asıl e-posta teslimatı mevcut
-- magic-link altyapısını (signInWithOtp) kullanır — yeni bir SMTP/servis eklenmez.

alter table public.events
  add column gallery_download_token text unique,
  add column gallery_download_token_expires_at timestamptz,
  add column gallery_download_requested_at timestamptz;

create index events_gallery_download_token_idx on public.events(gallery_download_token)
  where gallery_download_token is not null;

-- Owner'ın events üzerinde zaten blanket update policy'si var (events_owner_update),
-- ama cooldown'u client atlayabileceği için (kendi email_sent kotasını tüketip
-- kendi login akışını kilitleyebilir) token damgalamayı security definer bir
-- fonksiyona alıyoruz — set_upload_moderation_status ile aynı desen.
create or replace function public.request_gallery_download_link(
  p_event_id uuid,
  p_token text
) returns timestamptz
language plpgsql
security definer
set search_path = public
as $$
declare
  v_owner_id uuid;
  v_last_requested timestamptz;
  v_cooldown constant interval := interval '2 minutes';
  v_wait_seconds integer;
  v_expires_at timestamptz;
begin
  if p_token !~ '^[A-Za-z0-9_-]{21,64}$' then
    raise exception 'invalid_token';
  end if;

  select owner_id, gallery_download_requested_at
    into v_owner_id, v_last_requested
    from public.events
    where id = p_event_id;

  if v_owner_id is null or v_owner_id <> auth.uid() then
    raise exception 'not_found';
  end if;

  if v_last_requested is not null and v_last_requested > now() - v_cooldown then
    v_wait_seconds := greatest(1, ceil(extract(epoch from (v_last_requested + v_cooldown - now())))::integer);
    raise exception 'rate_limited:%', v_wait_seconds;
  end if;

  v_expires_at := now() + interval '48 hours';

  update public.events
  set gallery_download_token = p_token,
      gallery_download_token_expires_at = v_expires_at,
      gallery_download_requested_at = now()
  where id = p_event_id;

  return v_expires_at;
end;
$$;

revoke all on function public.request_gallery_download_link(uuid, text) from public;
grant execute on function public.request_gallery_download_link(uuid, text) to authenticated;
