import 'server-only'
import { createServerClient } from '@/lib/supabase/server'
import type { Database } from '@/types/supabase'

type ContentRow = Database['public']['Tables']['contents']['Row'] & {
  authors: Pick<Database['public']['Tables']['authors']['Row'], 'authorName'> | null
  images: Pick<Database['public']['Tables']['images']['Row'], 'imageLink'> | null
}

export interface NormalizedContent {
  id: string
  title: string
  slug: string
  excerpt: string | null
  date: string | null
  author: string
  image: string
}

export interface NormalizedContentFull extends NormalizedContent {
  paragraph: string | null
}

function mapRow(item: ContentRow, defaultAuthor?: string): NormalizedContent {
  const rawAuthor = item.authors
  const rawImages = item.images
  return {
    id: item.contentId.toString(),
    title: item.title,
    slug: item.slug,
    excerpt: item.excerpt || null,
    date: item.date || null,
    author: rawAuthor?.authorName || defaultAuthor || 'Hudyat Staff',
    image: rawImages?.imageLink || '/images/hudyatplaceholder.webp',
  }
}

function mapRowFull(item: ContentRow & { paragraph: string | null }): NormalizedContentFull {
  const base = mapRow(item)
  return {
    ...base,
    paragraph: item.paragraph,
  }
}

const DEFAULT_SELECT = `contentId, title, excerpt, date, slug, authors(authorName), images(imageLink)`
const FULL_SELECT = `contentId, title, excerpt, paragraph, date, slug, authors(authorName), images(imageLink)`

export async function getContentsByType(
  typeId: number,
  opts?: { limit?: number; page?: number; q?: string; defaultAuthor?: string }
): Promise<{ data: NormalizedContent[]; count: number | null }> {
  const supabase = createServerClient()
  const pageSize = opts?.limit ?? 9
  const page = opts?.page ?? 1
  const from = (page - 1) * pageSize

  let query = supabase
    .from('contents')
    .select(DEFAULT_SELECT, { count: 'exact' })
    .eq('typeId', typeId)

  if (opts?.q) {
    query = query.ilike('title', `%${opts.q}%`)
  }

  const { data, count } = await query
    .order('date', { ascending: false })
    .range(from, from + pageSize - 1)

  return {
    data: (data || []).map((item) => mapRow(item as unknown as ContentRow, opts?.defaultAuthor)),
    count,
  }
}

export async function getContentBySlug(slug: string): Promise<NormalizedContentFull | null> {
  const supabase = createServerClient()
  const { data } = await supabase
    .from('contents')
    .select(FULL_SELECT)
    .eq('slug', slug)
    .maybeSingle()

  if (!data) return null
  return mapRowFull(data as unknown as ContentRow & { paragraph: string | null })
}

export async function getLatestNews(limit = 9): Promise<NormalizedContent[]> {
  const supabase = createServerClient()
  const { data } = await supabase
    .from('contents')
    .select(DEFAULT_SELECT)
    .eq('typeId', 1)
    .order('date', { ascending: false })
    .limit(limit)

  return (data || []).map((item) => mapRow(item as unknown as ContentRow))
}

export async function searchContents(
  q: string,
  opts?: { limit?: number; defaultAuthor?: string }
): Promise<NormalizedContent[]> {
  const supabase = createServerClient()
  const { data } = await supabase
    .from('contents')
    .select(DEFAULT_SELECT)
    .ilike('title', `%${q}%`)
    .order('date', { ascending: false })
    .limit(opts?.limit ?? 20)

  return (data || []).map((item) => mapRow(item as unknown as ContentRow, opts?.defaultAuthor))
}

export async function getHomepageCategoryGrids(): Promise<Record<string, NormalizedContent[]>> {
  const [features, editorials, opinions, literary, sports] = await Promise.all([
    getContentsByType(2, { limit: 3 }),
    getContentsByType(3, { limit: 3 }),
    getContentsByType(4, { limit: 3 }),
    getContentsByType(5, { limit: 3 }),
    getContentsByType(6, { limit: 3 }),
  ])

  return {
    features: features.data,
    editorials: editorials.data,
    opinions: opinions.data,
    literary: literary.data,
    sports: sports.data,
  }
}
