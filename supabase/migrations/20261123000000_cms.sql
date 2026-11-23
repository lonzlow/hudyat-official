-- Hudyat CMS: article status workflow, staff roles, and Row Level Security.
--
-- Public site (anon key) can only read PUBLISHED articles.
-- Editors can do anything; writers can create/edit their own non-published articles.
--
-- Apply with `supabase db push`, or paste into the Supabase SQL editor.
-- NOTE: step 0 drops EVERY existing policy on the CMS tables so this file is the
-- single source of truth. Read the policies you have today before you run it.

-- 0. Start clean -------------------------------------------------------------
do $$
declare r record;
begin
  for r in
    select policyname, tablename from pg_policies
    where schemaname = 'public'
      and tablename in ('contents','authors','images','videos','tags','content_tags','article_views','staff')
  loop
    execute format('drop policy if exists %I on public.%I', r.policyname, r.tablename);
  end loop;
end $$;

-- 1. contents: workflow columns ---------------------------------------------
-- Existing rows are backfilled as 'published' (the column default at creation time),
-- then the default flips to 'draft' for new rows.
alter table public.contents
  add column if not exists status text not null default 'published'
    check (status in ('draft', 'review', 'published')),
  add column if not exists created_by uuid references auth.users (id) on delete set null,
  add column if not exists updated_at timestamptz not null default now();

alter table public.contents alter column status set default 'draft';

-- Fails if two existing articles share a slug: fix those rows first.
create unique index if not exists contents_slug_key on public.contents (slug);

create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists contents_touch_updated_at on public.contents;
create trigger contents_touch_updated_at
  before update on public.contents
  for each row execute function public.touch_updated_at();

-- 2. staff -------------------------------------------------------------------
create table if not exists public.staff (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text,
  role       text not null check (role in ('writer', 'editor')),
  author_id  integer references public.authors (author_id) on delete set null,
  created_at timestamptz not null default now()
);

-- Role of the signed-in user, or null. security definer so policies can call it
-- without recursing into the staff table's own policies.
create or replace function public.staff_role() returns text
language sql stable security definer set search_path = public as $$
  select role from public.staff where user_id = auth.uid()
$$;
revoke all on function public.staff_role() from public;
grant execute on function public.staff_role() to anon, authenticated;

-- Never leave the site without an editor.
create or replace function public.keep_one_editor() returns trigger
language plpgsql as $$
begin
  if old.role = 'editor' and new.role <> 'editor'
     and (select count(*) from public.staff where role = 'editor') <= 1 then
    raise exception 'Cannot demote the last editor';
  end if;
  return new;
end $$;

drop trigger if exists staff_keep_one_editor on public.staff;
create trigger staff_keep_one_editor
  before update on public.staff
  for each row execute function public.keep_one_editor();

-- 3. Row Level Security ------------------------------------------------------
alter table public.contents      enable row level security;
alter table public.authors       enable row level security;
alter table public.images        enable row level security;
alter table public.videos        enable row level security;
alter table public.tags          enable row level security;
alter table public.content_tags  enable row level security;
alter table public.article_views enable row level security;
alter table public.staff         enable row level security;

-- contents
create policy contents_public_read on public.contents
  for select to anon, authenticated using (status = 'published');

create policy contents_editor_all on public.contents
  for all to authenticated
  using (public.staff_role() = 'editor')
  with check (public.staff_role() = 'editor');

create policy contents_writer_read_own on public.contents
  for select to authenticated
  using (public.staff_role() = 'writer' and created_by = auth.uid());

create policy contents_writer_insert on public.contents
  for insert to authenticated
  with check (
    public.staff_role() = 'writer' and created_by = auth.uid()
    and status in ('draft', 'review')
  );

-- A writer can never publish: the new row must also be non-published.
create policy contents_writer_update on public.contents
  for update to authenticated
  using (public.staff_role() = 'writer' and created_by = auth.uid() and status <> 'published')
  with check (public.staff_role() = 'writer' and created_by = auth.uid() and status <> 'published');

-- authors / videos / tags: public read, editor write
create policy authors_public_read on public.authors for select to anon, authenticated using (true);
create policy authors_editor_write on public.authors for all to authenticated
  using (public.staff_role() = 'editor') with check (public.staff_role() = 'editor');

create policy videos_public_read on public.videos for select to anon, authenticated using (true);
create policy videos_editor_write on public.videos for all to authenticated
  using (public.staff_role() = 'editor') with check (public.staff_role() = 'editor');

create policy tags_public_read on public.tags for select to anon, authenticated using (true);
create policy tags_editor_write on public.tags for all to authenticated
  using (public.staff_role() = 'editor') with check (public.staff_role() = 'editor');

-- images: public read, editor write, writers can add (cover uploads)
create policy images_public_read on public.images for select to anon, authenticated using (true);
create policy images_editor_write on public.images for all to authenticated
  using (public.staff_role() = 'editor') with check (public.staff_role() = 'editor');
create policy images_writer_insert on public.images for insert to authenticated
  with check (public.staff_role() = 'writer');

-- content_tags: public read, editor write, writers manage tags of their own unpublished articles
create policy content_tags_public_read on public.content_tags
  for select to anon, authenticated using (true);
create policy content_tags_editor_write on public.content_tags for all to authenticated
  using (public.staff_role() = 'editor') with check (public.staff_role() = 'editor');
create policy content_tags_writer_write on public.content_tags for all to authenticated
  using (
    public.staff_role() = 'writer' and exists (
      select 1 from public.contents c
      where c.content_id = content_tags.content_id
        and c.created_by = auth.uid() and c.status <> 'published'
    )
  )
  with check (
    public.staff_role() = 'writer' and exists (
      select 1 from public.contents c
      where c.content_id = content_tags.content_id
        and c.created_by = auth.uid() and c.status <> 'published'
    )
  );

-- article_views: anyone can record a view, anyone can read (trending needs it),
-- editors can clean up (needed when deleting an article).
create policy article_views_public_insert on public.article_views
  for insert to anon, authenticated with check (true);
create policy article_views_public_read on public.article_views
  for select to anon, authenticated using (true);
create policy article_views_editor_delete on public.article_views
  for delete to authenticated using (public.staff_role() = 'editor');

-- staff: read your own row; editors read and update everyone. Rows are created
-- from the SQL editor (see supabase/README.md), never from the client.
create policy staff_read_own on public.staff
  for select to authenticated using (user_id = auth.uid());
create policy staff_editor_read on public.staff
  for select to authenticated using (public.staff_role() = 'editor');
create policy staff_editor_update on public.staff
  for update to authenticated
  using (public.staff_role() = 'editor') with check (public.staff_role() = 'editor');
