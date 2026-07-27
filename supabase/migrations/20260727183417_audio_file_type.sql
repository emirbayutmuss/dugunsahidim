-- Faz C: Sesli Misafir Defteri — uploads.file_type'a 'audio' ekle
alter table public.uploads drop constraint uploads_file_type_check;
alter table public.uploads add constraint uploads_file_type_check
  check (file_type in ('image','video','audio'));
