import Link from 'next/link'
import { getTagsByContentId } from '@/data/tags'

interface TagBadgesProps {
  contentId: string | number
}

export async function TagBadges({ contentId }: TagBadgesProps) {
  const id = typeof contentId === 'string' ? parseInt(contentId, 10) : contentId
  if (isNaN(id)) return null

  const tags = await getTagsByContentId(id)
  if (tags.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Link
          key={tag.tag_id}
          href={`/tag/${tag.slug}`}
          className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          #{tag.name}
        </Link>
      ))}
    </div>
  )
}
