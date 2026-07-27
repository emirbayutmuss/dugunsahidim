-- Güvenlik testi anon'un set_upload_moderation_status'u çağırabildiğini
-- (permission denied yerine fonksiyon içi 'not found' hatası aldığını) ortaya
-- çıkardı. "revoke all ... from public" sadece PUBLIC pseudo-role'ünden alır;
-- anon'a ayrıca/örtük verilmiş olabilecek execute'u kaldırmaz. Açıkça revoke ediliyor.
revoke execute on function public.set_upload_moderation_status(uuid, text) from anon;
