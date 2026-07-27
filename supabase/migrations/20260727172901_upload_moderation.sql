-- Faz A: Moderasyon — uploads.moderation_status + onay/red RPC
-- status = teknik yükleme durumu (pending/processing/ready/rejected)
-- moderation_status = içerik onay durumu (pending/approved/rejected) — ayrı kavram, kasıtlı ayrı kolon

alter table public.uploads
  add column moderation_status text not null default 'pending'
    check (moderation_status in ('pending','approved','rejected'));

-- Backfill: bu değişiklikten önce zaten 'ready' olan yüklemeler geriye dönük
-- approved sayılır — owner'ın biriken galerisi Faz B'de duvar açıldığında
-- aniden "onaysız" görünmesin diye.
update public.uploads set moderation_status = 'approved' where status = 'ready';

create index uploads_event_moderation_idx on public.uploads(event_id, moderation_status);

-- Owner'a blanket update RLS policy açmak yerine (file_path/status gibi diğer
-- kolonları tamperlemeye açar), sadece moderation_status'u değiştiren,
-- sahiplik kontrolü içeren tek amaçlı bir fonksiyon.
create or replace function public.set_upload_moderation_status(
  p_upload_id uuid,
  p_status text
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_owner_id uuid;
begin
  if p_status not in ('approved','rejected') then
    raise exception 'invalid status';
  end if;

  select e.owner_id into v_owner_id
  from public.uploads u
  join public.events e on e.id = u.event_id
  where u.id = p_upload_id;

  if v_owner_id is null or v_owner_id <> auth.uid() then
    raise exception 'not found';
  end if;

  update public.uploads set moderation_status = p_status where id = p_upload_id;
end;
$$;

revoke all on function public.set_upload_moderation_status(uuid, text) from public;
grant execute on function public.set_upload_moderation_status(uuid, text) to authenticated;
