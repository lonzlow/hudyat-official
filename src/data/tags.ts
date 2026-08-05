import 'server-only'
import { createServerClient } from '@/lib/supabase/server'
import type { NormalizedContent } from './contents'

export interface Tag {
  tag_id: number
  name: string
  slug: string
}

export async function getTagsByContentId(contentId: number): Promise<Tag[]> {
  const supabase = createServerClient()
  const { data } = await (supabase as any)
    .from('content_tags')
    .select('tags(*)')
    .eq('content_id', contentId)

  if (!data) return []

  return data
    .map((row: any) => row.tags)
    .filter(Boolean) as Tag[]
}

export async function getAllTags(): Promise<Tag[]> {
  const supabase = createServerClient()
  const { data } = await (supabase as any)
    .from('tags')
    .select('*')
    .order('name')

  return (data || []) as Tag[]
}

export async function getTagBySlug(slug: string): Promise<Tag | null> {
  const supabase = createServerClient()
  const { data } = await (supabase as any)
    .from('tags')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  return data as Tag | null
}

export async function getArticlesByTag(slug: string, limit = 50): Promise<NormalizedContent[]> {
  const supabase = createServerClient()

  const { data: tagData } = await (supabase as any)
    .from('tags')
    .select('tag_id')
    .eq('slug', slug)
    .maybeSingle()

  if (!tagData) return []

  const { data: links } = await (supabase as any)
    .from('content_tags')
    .select('content_id')
    .eq('tag_id', tagData.tag_id)
    .order('content_id', { ascending: false })
    .limit(limit)

  if (!links || links.length === 0) return []

  const ids = links.map((l: any) => l.content_id)

  const { data: articles } = await supabase
    .from('contents')
    .select(`content_id, title, excerpt, date, slug, authors(author_name), images(image_link)`)
    .in('content_id', ids)
    .order('date', { ascending: false })

  if (!articles) return []

  return (articles as any[]).map((row) => ({
    id: row.content_id.toString(),
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt || null,
    date: row.date || null,
    author: row.authors?.author_name || 'Hudyat Staff',
    image: row.images?.image_link || '/images/hudyatplaceholder.webp',
  }))
}
