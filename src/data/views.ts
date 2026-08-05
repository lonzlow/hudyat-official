import 'server-only'
import { createServerClient } from '@/lib/supabase/server'
import type { NormalizedContent } from './contents'

export async function recordView(contentId: string | number) {
  const id = typeof contentId === 'string' ? parseInt(contentId, 10) : contentId
  if (isNaN(id)) return

  const supabase = createServerClient()
  await (supabase as any).from('article_views').insert({ content_id: id })
}

export async function getTrendingArticles(limit = 5): Promise<NormalizedContent[]> {
  const supabase = createServerClient()
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const { data: raw } = await (supabase as any)
    .from('article_views')
    .select('content_id, viewed_at')
    .gte('viewed_at', sevenDaysAgo)

  if (!raw || raw.length === 0) {
    return getFallbackArticles(limit)
  }

  const countMap = new Map<number, number>()
  for (const row of raw) {
    countMap.set(row.content_id, (countMap.get(row.content_id) || 0) + 1)
  }

  const sortedIds = [...countMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => id)

  if (sortedIds.length === 0) return getFallbackArticles(limit)

  const { data: articles } = await supabase
    .from('contents')
    .select(`content_id, title, excerpt, date, slug, authors(author_name), images(image_link)`)
    .in('content_id', sortedIds)
    .order('date', { ascending: false })

  if (!articles) return getFallbackArticles(limit)

  const articleMap = new Map(articles.map((a: any) => [a.content_id, a]))

  return sortedIds
    .map((id) => {
      const row = articleMap.get(id)
      if (!row) return null
      return {
        id: row.content_id.toString(),
        title: row.title,
        slug: row.slug,
        excerpt: row.excerpt || null,
        date: row.date || null,
        author: row.authors?.author_name || 'Hudyat Staff',
        image: row.images?.image_link || '/images/hudyatplaceholder.webp',
      } as NormalizedContent
    })
    .filter(Boolean) as NormalizedContent[]
}

async function getFallbackArticles(limit = 5): Promise<NormalizedContent[]> {
  const supabase = createServerClient()
  const { data } = await supabase
    .from('contents')
    .select(`content_id, title, excerpt, date, slug, authors(author_name), images(image_link)`)
    .order('date', { ascending: false })
    .limit(limit)

  if (!data) return []

  return (data as any[]).map((row) => ({
    id: row.content_id.toString(),
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt || null,
    date: row.date || null,
    author: row.authors?.author_name || 'Hudyat Staff',
    image: row.images?.image_link || '/images/hudyatplaceholder.webp',
  }))
}
