"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { requireStaff } from "@/data/staff"
import { createSessionClient } from "@/lib/supabase/server"
import { uploadImage } from "@/lib/supabase/upload"
import { articleSchema, type ArticleInput, type ArticleStatus } from "@/lib/cms/schema"
import { serializeParagraphs } from "@/lib/cms/paragraphs"

type SaveResult = { ok: true; id: number } | { ok: false; error: string }

// One entry point for "Save", "Submit for review" and "Publish". RLS enforces the same rules
// in the database, so a writer cannot publish even by calling Supabase directly.
export async function saveArticle(
  id: number | null,
  input: ArticleInput,
  then?: "review" | "publish"
): Promise<SaveResult> {
  const staff = await requireStaff()

  const parsed = articleSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Check the form." }
  const v = parsed.data

  if (then === "publish" && staff.role !== "editor") {
    return { ok: false, error: "Only editors can publish." }
  }

  const supabase = await createSessionClient()

  let current: ArticleStatus = "draft"
  if (id !== null) {
    const { data: existing } = await supabase
      .from("contents")
      .select("status")
      .eq("content_id", id)
      .maybeSingle()
    if (!existing) return { ok: false, error: "Article not found." }
    if (staff.role === "writer" && existing.status === "published") {
      return { ok: false, error: "Only editors can edit published articles." }
    }
    current = existing.status
  }

  const status: ArticleStatus =
    then === "publish" ? "published" : then === "review" && current !== "published" ? "review" : current

  const row = {
    title: v.title,
    slug: v.slug,
    type_id: v.type_id,
    author_id: v.author_id,
    excerpt: v.excerpt || null,
    paragraph: serializeParagraphs(v.body),
    date: v.date || (status === "published" ? new Date().toISOString().slice(0, 10) : null),
    image_id: v.image_id,
    status,
  }

  const result =
    id === null
      ? await supabase.from("contents").insert({ ...row, created_by: staff.userId }).select("content_id").single()
      : await supabase.from("contents").update(row).eq("content_id", id).select("content_id").single()

  if (result.error || !result.data) {
    if (result.error?.code === "23505") return { ok: false, error: "That slug is already used by another article." }
    // An update that RLS filters out matches no row, which .single() reports as an error.
    return { ok: false, error: "Could not save. You may not have permission to change this article." }
  }

  const contentId = result.data.content_id

  const { error: delError } = await supabase.from("content_tags").delete().eq("content_id", contentId)
  if (delError) return { ok: false, error: "Saved, but the tags could not be updated." }
  if (v.tag_ids.length > 0) {
    const { error: tagError } = await supabase
      .from("content_tags")
      .insert(v.tag_ids.map((tag_id) => ({ content_id: contentId, tag_id })))
    if (tagError) return { ok: false, error: "Saved, but the tags could not be updated." }
  }

  revalidatePath("/admin", "layout")
  return { ok: true, id: contentId }
}

type UploadResult = { ok: true; image_id: number; url: string } | { ok: false; error: string }

export async function uploadCoverImage(formData: FormData): Promise<UploadResult> {
  await requireStaff()

  const file = formData.get("file")
  if (!(file instanceof File)) return { ok: false, error: "Choose an image first." }
  const alt = String(formData.get("alt") ?? "").trim().slice(0, 200)

  const supabase = await createSessionClient()
  const uploaded = await uploadImage(supabase, file, "articles")
  if (!uploaded.ok) return uploaded

  const { data, error } = await supabase
    .from("images")
    .insert({ image_link: uploaded.url, alt_text: alt || null })
    .select("image_id")
    .single()
  if (error || !data) return { ok: false, error: "The image uploaded but could not be saved." }

  return { ok: true, image_id: data.image_id, url: uploaded.url }
}

export async function unpublishArticle(formData: FormData) {
  await requireStaff("editor")
  const id = Number(formData.get("id"))
  if (!Number.isInteger(id)) redirect("/admin")

  const supabase = await createSessionClient()
  await supabase.from("contents").update({ status: "draft" }).eq("content_id", id)

  revalidatePath("/admin", "layout")
  redirect(`/admin/articles/${id}`)
}

export async function deleteArticle(formData: FormData) {
  await requireStaff("editor")
  const id = Number(formData.get("id"))
  if (!Number.isInteger(id)) redirect("/admin")

  const supabase = await createSessionClient()
  // Rows that reference the article have to go first.
  await supabase.from("content_tags").delete().eq("content_id", id)
  await supabase.from("article_views").delete().eq("content_id", id)
  const { error } = await supabase.from("contents").delete().eq("content_id", id)
  if (error) redirect(`/admin/articles/${id}?error=${encodeURIComponent("Could not delete the article.")}`)

  revalidatePath("/admin", "layout")
  redirect("/admin?ok=" + encodeURIComponent("Article deleted."))
}
