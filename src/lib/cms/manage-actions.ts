"use server"

import { redirect } from "next/navigation"
import { requireStaff } from "@/data/staff"
import { createSessionClient } from "@/lib/supabase/server"
import { uploadImage } from "@/lib/supabase/upload"
import { extractYouTubeId } from "@/lib/youtube"
import { SLUG_RE, slugify } from "@/lib/cms/schema"

// Every action here is editor-only (RLS enforces it too) and reports back through ?ok= / ?error=.
function flash(path: string, kind: "ok" | "error", message: string): never {
  redirect(`${path}?${kind}=${encodeURIComponent(message)}`)
}

const text = (f: FormData, key: string) => String(f.get(key) ?? "").trim()
const num = (f: FormData, key: string) => Number(f.get(key))

// ---- Tags -----------------------------------------------------------------

export async function createTag(formData: FormData) {
  await requireStaff("editor")
  const name = text(formData, "name").slice(0, 60)
  const slug = slugify(name)
  if (!name || !slug) flash("/admin/tags", "error", "Enter a tag name.")

  const supabase = await createSessionClient()
  const { error } = await supabase.from("tags").insert({ name, slug })
  if (error) flash("/admin/tags", "error", error.code === "23505" ? "That tag already exists." : "Could not add the tag.")
  flash("/admin/tags", "ok", `Added “${name}”.`)
}

export async function updateTag(formData: FormData) {
  await requireStaff("editor")
  const name = text(formData, "name").slice(0, 60)
  const slug = text(formData, "slug")
  const id = num(formData, "id")
  if (!Number.isInteger(id) || !name || !SLUG_RE.test(slug)) flash("/admin/tags", "error", "Check the tag name and slug.")

  const supabase = await createSessionClient()
  const { error } = await supabase.from("tags").update({ name, slug }).eq("tag_id", id)
  if (error) flash("/admin/tags", "error", error.code === "23505" ? "That slug is already used." : "Could not save the tag.")
  flash("/admin/tags", "ok", "Tag saved.")
}

export async function deleteTag(formData: FormData) {
  await requireStaff("editor")
  const id = num(formData, "id")
  if (!Number.isInteger(id)) flash("/admin/tags", "error", "Unknown tag.")

  const supabase = await createSessionClient()
  await supabase.from("content_tags").delete().eq("tag_id", id)
  const { error } = await supabase.from("tags").delete().eq("tag_id", id)
  if (error) flash("/admin/tags", "error", "Could not delete the tag.")
  flash("/admin/tags", "ok", "Tag deleted.")
}

// ---- Authors --------------------------------------------------------------

export async function createAuthor(formData: FormData) {
  await requireStaff("editor")
  const name = text(formData, "name").slice(0, 100)
  if (!name) flash("/admin/authors", "error", "Enter a name.")

  const supabase = await createSessionClient()
  let avatar_url: string | null = null
  const file = formData.get("avatar")
  if (file instanceof File && file.size > 0) {
    const up = await uploadImage(supabase, file, "authors")
    if (!up.ok) flash("/admin/authors", "error", up.error)
    avatar_url = up.url
  }

  const { error } = await supabase.from("authors").insert({ author_name: name, avatar_url })
  if (error) flash("/admin/authors", "error", "Could not add the author.")
  flash("/admin/authors", "ok", `Added ${name}.`)
}

export async function updateAuthor(formData: FormData) {
  await requireStaff("editor")
  const id = num(formData, "id")
  const name = text(formData, "name").slice(0, 100)
  if (!Number.isInteger(id) || !name) flash("/admin/authors", "error", "Enter a name.")

  const supabase = await createSessionClient()
  const patch: { author_name: string; avatar_url?: string } = { author_name: name }
  const file = formData.get("avatar")
  if (file instanceof File && file.size > 0) {
    const up = await uploadImage(supabase, file, "authors")
    if (!up.ok) flash("/admin/authors", "error", up.error)
    patch.avatar_url = up.url
  }

  const { error } = await supabase.from("authors").update(patch).eq("author_id", id)
  if (error) flash("/admin/authors", "error", "Could not save the author.")
  flash("/admin/authors", "ok", "Author saved.")
}

export async function deleteAuthor(formData: FormData) {
  await requireStaff("editor")
  const id = num(formData, "id")
  if (!Number.isInteger(id)) flash("/admin/authors", "error", "Unknown author.")

  const supabase = await createSessionClient()
  const { error } = await supabase.from("authors").delete().eq("author_id", id)
  if (error) {
    flash(
      "/admin/authors",
      "error",
      error.code === "23503"
        ? "This author still has articles or staff accounts. Change those bylines first."
        : "Could not delete the author."
    )
  }
  flash("/admin/authors", "ok", "Author deleted.")
}

// ---- Videos ---------------------------------------------------------------

export async function addVideo(formData: FormData) {
  await requireStaff("editor")
  const link = text(formData, "link")
  const name = text(formData, "name").slice(0, 200)
  if (!extractYouTubeId(link)) flash("/admin/videos", "error", "Paste a YouTube video link.")

  const supabase = await createSessionClient()
  const { error } = await supabase.from("videos").insert({ video_link: link, video_name: name || null })
  if (error) flash("/admin/videos", "error", "Could not add the video.")
  flash("/admin/videos", "ok", "Video added.")
}

export async function renameVideo(formData: FormData) {
  await requireStaff("editor")
  const id = num(formData, "id")
  if (!Number.isInteger(id)) flash("/admin/videos", "error", "Unknown video.")

  const supabase = await createSessionClient()
  const { error } = await supabase
    .from("videos")
    .update({ video_name: text(formData, "name").slice(0, 200) || null })
    .eq("video_id", id)
  if (error) flash("/admin/videos", "error", "Could not save the video.")
  flash("/admin/videos", "ok", "Video saved.")
}

export async function deleteVideo(formData: FormData) {
  await requireStaff("editor")
  const id = num(formData, "id")
  if (!Number.isInteger(id)) flash("/admin/videos", "error", "Unknown video.")

  const supabase = await createSessionClient()
  const { error } = await supabase.from("videos").delete().eq("video_id", id)
  if (error) flash("/admin/videos", "error", "Could not delete the video.")
  flash("/admin/videos", "ok", "Video deleted.")
}

// ---- Staff ----------------------------------------------------------------
// Staff are invited from the Supabase dashboard (see supabase/README.md); this only changes
// an existing member's role and byline, so no service-role key is needed in the app.

export async function updateStaff(formData: FormData) {
  await requireStaff("editor")
  const userId = text(formData, "user_id")
  const role = text(formData, "role")
  const authorRaw = text(formData, "author_id")
  if (!userId || (role !== "writer" && role !== "editor")) flash("/admin/staff", "error", "Check the role.")

  const supabase = await createSessionClient()
  const { error } = await supabase
    .from("staff")
    .update({ role, author_id: authorRaw ? Number(authorRaw) : null })
    .eq("user_id", userId)
  if (error) {
    flash(
      "/admin/staff",
      "error",
      error.message.includes("last editor") ? "You cannot demote the last editor." : "Could not save."
    )
  }
  flash("/admin/staff", "ok", "Saved.")
}
