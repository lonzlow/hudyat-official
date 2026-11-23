import { defineConfig } from "@playwright/test"

// Run against a LOCAL Supabase stack (`npx supabase start`) with the migration applied and
// the app started with the local URL/keys. See tests/e2e/README.md.
export default defineConfig({
  testDir: "./tests/e2e",
  use: { baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3000" },
  reporter: [["list"]],
})
