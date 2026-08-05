import 'server-only'
import { createServerClient } from '@/lib/supabase/server'
import type { Database } from '@/types/supabase'

type ContentRow = Database['public']['Tables']['contents']['Row'] & {
  authors: Pick<Database['public']['Tables']['authors']['Row'], 'author_name'> | null
  images: Pick<Database['public']['Tables']['images']['Row'], 'image_link'> | null
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
  type_id: number
}

function mapRow(item: ContentRow, defaultAuthor?: string): NormalizedContent {
  const rawAuthor = item.authors
  const rawImages = item.images
  return {
    id: item.content_id.toString(),
    title: item.title,
    slug: item.slug,
    excerpt: item.excerpt || null,
    date: item.date || null,
    author: rawAuthor?.author_name || defaultAuthor || 'Hudyat Staff',
    image: rawImages?.image_link || '/images/hudyatplaceholder.webp',
  }
}

function mapRowFull(item: ContentRow & { paragraph: string | null }): NormalizedContentFull {
  const base = mapRow(item)
  return {
    ...base,
    paragraph: item.paragraph,
    type_id: item.type_id,
  }
}

const DEFAULT_SELECT = `content_id, title, excerpt, date, slug, authors(author_name), images(image_link)`
const FULL_SELECT = `content_id, title, excerpt, paragraph, date, slug, type_id, authors(author_name), images(image_link)`

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
    .eq('type_id', typeId)

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
    .eq('type_id', 1)
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

export const TYPE_MAP: Record<number, string> = {
  1: 'News',
  2: 'Feature',
  3: 'Editorial',
  4: 'Opinion',
  5: 'Literary',
  6: 'Sports',
} as const

export async function getAllContents(limit = 20): Promise<(NormalizedContent & { type_id: number })[]> {
  const supabase = createServerClient()
  const { data } = await supabase
    .from('contents')
    .select(`content_id, title, excerpt, date, slug, type_id, authors(author_name), images(image_link)`)
    .order('date', { ascending: false })
    .limit(limit)

  return (data || []).map((item) => {
    const row = item as unknown as ContentRow & { type_id: number }
    const mapped = mapRow(row)
    return { ...mapped, type_id: row.type_id }
  })
}

export async function getRelatedArticles(
  currentSlug: string,
  typeId: number,
  limit = 4
): Promise<NormalizedContent[]> {
  const supabase = createServerClient()
  const { data } = await supabase
    .from('contents')
    .select(DEFAULT_SELECT)
    .eq('type_id', typeId)
    .neq('slug', currentSlug)
    .order('date', { ascending: false })
    .limit(limit)

  return (data || []).map((item) => mapRow(item as unknown as ContentRow))
}

export async function getArchiveYears(): Promise<{ year: number; count: number }[]> {
  const supabase = createServerClient()
  const { data } = await supabase
    .from('contents')
    .select('date')
    .not('date', 'is', null)
    .order('date', { ascending: false })

  if (!data) return []

  const yearCounts = new Map<number, number>()
  for (const row of data) {
    if (!row.date) continue
    const year = new Date(row.date).getFullYear()
    if (!isNaN(year)) {
      yearCounts.set(year, (yearCounts.get(year) || 0) + 1)
    }
  }

  return Array.from(yearCounts.entries())
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => b.year - a.year)
}

export async function getArticlesByYear(year: number): Promise<NormalizedContent[]> {
  const supabase = createServerClient()
  const startDate = `${year}-01-01`
  const endDate = `${year + 1}-01-01`

  const { data } = await supabase
    .from('contents')
    .select(DEFAULT_SELECT)
    .gte('date', startDate)
    .lt('date', endDate)
    .order('date', { ascending: false })

  return (data || []).map((item) => mapRow(item as unknown as ContentRow))
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
