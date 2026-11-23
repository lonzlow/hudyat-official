import 'server-only'
import { createSessionClient } from '@/lib/supabase/server'
import type { ArticleStatus } from '@/lib/cms/schema'

export const ADMIN_PAGE_SIZE = 15

export interface ArticleListRow {
  content_id: number
  title: string
  slug: string
  status: ArticleStatus
  type_id: number
  date: string | null
  updated_at: string
  author: string
}

// All CMS reads go through the session client, so Row Level Security decides what each role can see.
export async function listArticles(opts: {
  status?: ArticleStatus
  createdBy?: string
  q?: string
  page?: number
}): Promise<{ rows: ArticleListRow[]; count: number }> {
  const supabase = await createSessionClient()
  const page = Math.max(1, opts.page ?? 1)
  const from = (page - 1) * ADMIN_PAGE_SIZE

  let query = supabase
    .from('contents')
    .select('content_id, title, slug, status, type_id, date, updated_at, authors(author_name)', { count: 'exact' })

  if (opts.status) query = query.eq('status', opts.status)
  if (opts.createdBy) query = query.eq('created_by', opts.createdBy)
  if (opts.q) query = query.ilike('title', `%${opts.q.replace(/[%_\\]/g, '\\$&')}%`)

  const { data, count } = await query
    .order('updated_at', { ascending: false })
    .range(from, from + ADMIN_PAGE_SIZE - 1)

  const rows = ((data ?? []) as unknown as (Omit<ArticleListRow, 'author'> & {
    authors: { author_name: string } | null
  })[]).map(({ authors, ...r }) => ({ ...r, author: authors?.author_name ?? '—' }))

  return { rows, count: count ?? 0 }
}

export interface ArticleForEdit {
  content_id: number
  title: string
  slug: string
  excerpt: string | null
  paragraph: string | null
  date: string | null
  type_id: number
  author_id: number | null
  image_id: number | null
  status: ArticleStatus
  created_by: string | null
  author_name: string | null
  image_url: string | null
  tag_ids: number[]
}

export async function getArticleForEdit(id: number): Promise<ArticleForEdit | null> {
  const supabase = await createSessionClient()
  const { data } = await supabase
    .from('contents')
    .select(
      'content_id, title, slug, excerpt, paragraph, date, type_id, author_id, image_id, status, created_by, authors(author_name), images(image_link)'
    )
    .eq('content_id', id)
    .maybeSingle()
  if (!data) return null

  const { data: tagRows } = await supabase.from('content_tags').select('tag_id').eq('content_id', id)

  const row = data as unknown as Omit<ArticleForEdit, 'author_name' | 'image_url' | 'tag_ids'> & {
    authors: { author_name: string } | null
    images: { image_link: string } | null
  }
  const { authors, images, ...rest } = row
  return {
    ...rest,
    author_name: authors?.author_name ?? null,
    image_url: images?.image_link ?? null,
    tag_ids: (tagRows ?? []).map((t) => t.tag_id),
  }
}

export async function listAuthors() {
  const supabase = await createSessionClient()
  const { data } = await supabase.from('authors').select('author_id, author_name, avatar_url').order('author_name')
  return data ?? []
}

export async function listTags() {
  const supabase = await createSessionClient()
  const { data } = await supabase.from('tags').select('tag_id, name, slug').order('name')
  return data ?? []
}

export async function listVideos() {
  const supabase = await createSessionClient()
  const { data } = await supabase
    .from('videos')
    .select('video_id, video_link, video_name')
    .order('video_id', { ascending: false })
  return data ?? []
}

export async function listStaff() {
  const supabase = await createSessionClient()
  const { data } = await supabase
    .from('staff')
    .select('user_id, email, role, author_id, created_at')
    .order('created_at')
  return data ?? []
}
