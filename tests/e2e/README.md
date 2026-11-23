# CMS end-to-end tests

These run against a **local** Supabase stack, never the hosted project.

```powershell
npx supabase start                      # needs Docker; applies supabase/migrations
```

Create one editor and one writer in the local stack (Studio at http://127.0.0.1:54323 ->
Authentication), add matching rows to `public.staff`, then start the app pointed at it:

```powershell
$env:NEXT_PUBLIC_SUPABASE_URL = "http://127.0.0.1:54321"
$env:NEXT_PUBLIC_SUPABASE_ANON_KEY = "<anon key printed by supabase start>"
npm run build; npm run start
```

In another terminal:

```powershell
$env:E2E_SUPABASE_URL = "http://127.0.0.1:54321"
$env:E2E_SUPABASE_ANON_KEY = "<same anon key>"
$env:E2E_WRITER_EMAIL = "writer@example.test"; $env:E2E_WRITER_PASSWORD = "..."
$env:E2E_EDITOR_EMAIL = "editor@example.test"; $env:E2E_EDITOR_PASSWORD = "..."
npm run test:e2e
```

Without the variables, the tests that need them are skipped. The "signed-out visitors"
and robots tests need only the running app.

Not wired into CI yet: that needs `supabase init` plus a baseline `db pull` first
(see supabase/README.md).
