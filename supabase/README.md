# Supabase setup for the CMS

The CLI has not been initialised in this repo, so there is no baseline of your
existing schema. Before relying on `supabase db push`, run once:

```powershell
npx supabase login
npx supabase init
npx supabase link --project-ref wilbmjjlzgcywjltfcku
npx supabase db pull        # writes a baseline migration of today's schema
```

Then apply the CMS migration (or paste `migrations/20261123000000_cms.sql` into
the SQL editor):

```powershell
npx supabase db push
```

**Before you apply it**

1. Read your current RLS policies (Dashboard -> Authentication -> Policies). The
   migration drops every policy on the CMS tables and replaces them.
2. If two articles share a slug, the unique index fails: fix those rows first.
3. Dashboard -> Authentication -> Sign In / Providers: turn **off** "Allow new
   users to sign up". Staff are invited from the dashboard.
4. Run `storage-policies.sql` after setting the bucket name.

**Create the first editor**

Invite yourself (Dashboard -> Authentication -> Users -> Invite), accept the
invite, then in the SQL editor:

```sql
insert into public.staff (user_id, email, role)
select id, email, 'editor' from auth.users where email = 'you@example.com';
```

Add writers the same way with `'writer'`, then link them to a byline from
`/admin/staff`.

**Invite link template** (Dashboard -> Authentication -> Email Templates): point the
invite and recovery links at the CMS so the session is created server-side:

```
{{ .SiteURL }}/admin/auth/confirm?token_hash={{ .TokenHash }}&type=invite
{{ .SiteURL }}/admin/auth/confirm?token_hash={{ .TokenHash }}&type=recovery
```

Finally regenerate the types: `npm run gen:types`.
