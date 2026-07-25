-- Atomic upsert+increment for upload_rate_limits, callable only by service_role
-- (used by the create-upload-ticket Edge Function to avoid a read-then-write race)

create or replace function public.increment_rate_limit(
  p_event_id uuid,
  p_ip_hash text,
  p_window_start timestamptz
) returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  insert into public.upload_rate_limits (event_id, ip_hash, window_start, upload_count)
  values (p_event_id, p_ip_hash, p_window_start, 1)
  on conflict (event_id, ip_hash, window_start)
  do update set upload_count = public.upload_rate_limits.upload_count + 1
  returning upload_count into v_count;

  return v_count;
end;
$$;

revoke all on function public.increment_rate_limit(uuid, text, timestamptz) from public;
grant execute on function public.increment_rate_limit(uuid, text, timestamptz) to service_role;
