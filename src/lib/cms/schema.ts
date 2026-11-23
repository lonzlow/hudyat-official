import { z } from "zod"

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
}

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

// Used by the editor form (client) and re-checked by the server action.
export const articleSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  slug: z.string().trim().regex(SLUG_RE, "Use lowercase letters, numbers and dashes").max(100),
  type_id: z.number().int().min(1).max(6),
  author_id: z.number().int().nullable(),
  excerpt: z.string().trim().max(500, "Keep the excerpt under 500 characters"),
  // A body starting with "[" would be read back as a legacy JSON article.
  body: z
    .string()
    .trim()
    .min(1, "Write the article body")
    .refine((s) => !s.startsWith("["), "The body cannot start with a [ character"),
  date: z.union([z.literal(""), z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid date")]),
  image_id: z.number().int().nullable(),
  tag_ids: z.array(z.number().int()),
})

export type ArticleInput = z.infer<typeof articleSchema>
export type ArticleStatus = "draft" | "review" | "published"
