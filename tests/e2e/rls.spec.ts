import { createClient } from "@supabase/supabase-js"
import { expect, test } from "@playwright/test"

// These tests try to WRITE with the public key. They only run against a local Supabase stack so a
// broken policy can never touch real data.
const url = process.env.E2E_SUPABASE_URL ?? ""
const anonKey = process.env.E2E_SUPABASE_ANON_KEY ?? ""
const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(url)

test.skip(!isLocal || !anonKey, "Set E2E_SUPABASE_URL (local) and E2E_SUPABASE_ANON_KEY to run the RLS tests")

const anon = () => createClient(url, anonKey)

test("the public key only sees published articles", async () => {
  const { data, error } = await anon().from("contents").select("content_id").neq("status", "published")
  expect(error).toBeNull()
  expect(data).toEqual([])
})

test("the public key cannot create articles", async () => {
  const { error } = await anon()
    .from("contents")
    .insert({ title: "x", slug: `rls-${Date.now()}`, type_id: 1, status: "published" })
  expect(error).not.toBeNull()
})

test("the public key cannot edit or delete articles", async () => {
  const db = anon()
  const update = await db.from("contents").update({ title: "hacked" }).gte("content_id", 0).select()
  expect(update.data ?? []).toEqual([])
  const del = await db.from("contents").delete().gte("content_id", 0).select()
  expect(del.data ?? []).toEqual([])
})

test("the public key cannot read or change staff", async () => {
  const db = anon()
  const read = await db.from("staff").select("user_id")
  expect(read.data ?? []).toEqual([])
  const update = await db.from("staff").update({ role: "editor" }).gte("created_at", "1970-01-01").select()
  expect(update.data ?? []).toEqual([])
})

test("anyone can still record a view", async () => {
  const { data: article } = await anon().from("contents").select("content_id").limit(1).maybeSingle()
  test.skip(!article, "No published article in the seed data")
  const { error } = await anon().from("article_views").insert({ content_id: article!.content_id })
  expect(error).toBeNull()
})
