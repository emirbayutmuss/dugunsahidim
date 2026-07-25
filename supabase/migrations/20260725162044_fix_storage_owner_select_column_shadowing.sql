-- Faz 0'daki storage_owner_select policy'sinde `storage.foldername(name)` içindeki
-- unqualified `name`, correlated subquery'deki `events e` tablosunun kendi `name`
-- sütununa (etkinlik adı) çözümleniyordu — outer storage.objects.name yerine.
-- Sonuç: owner hiçbir zaman kendi storage nesnelerini okuyamıyordu (Faz 4'te ortaya çıktı).

drop policy if exists storage_owner_select on storage.objects;

create policy storage_owner_select on storage.objects
  for select to authenticated
  using (
    bucket_id = 'event-media'
    and exists (
      select 1 from public.events e
      where e.id::text = (storage.foldername(storage.objects.name))[1]
        and e.owner_id = auth.uid()
    )
  );
