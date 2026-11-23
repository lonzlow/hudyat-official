-- Storage policies for CMS image uploads. Not a migration: the bucket name is
-- specific to your project. Replace 'images' below with the bucket your existing
-- image URLs use (the path segment after /object/public/), then run it once in
-- the Supabase SQL editor. Also set IMAGE_BUCKET in the app's environment if it
-- is not 'images'.

drop policy if exists "cms_images_public_read" on storage.objects;
drop policy if exists "cms_images_staff_insert" on storage.objects;
drop policy if exists "cms_images_editor_delete" on storage.objects;

create policy "cms_images_public_read" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'images');

-- Any staff member can upload, only under the prefixes the CMS uses.
create policy "cms_images_staff_insert" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'images'
    and public.staff_role() is not null
    and (storage.foldername(name))[1] in ('articles', 'authors')
  );

create policy "cms_images_editor_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'images' and public.staff_role() = 'editor');
