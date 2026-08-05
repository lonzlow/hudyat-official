import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getTagBySlug, getArticlesByTag, getAllTags } from '@/data/tags'

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tag = await getTagBySlug(slug)
  if (!tag) return { title: 'Tag Not Found' }
  return { title: `#${tag.name}`, description: `Articles tagged with ${tag.name}` }
}

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [tag, articles, allTags] = await Promise.all([
    getTagBySlug(slug),
    getArticlesByTag(slug),
    getAllTags(),
  ])

  if (!tag) notFound()

  return (
    <div className="container py-12">
      <h1 className="font-display text-4xl font-bold mb-2">#{tag.name}</h1>
      <p className="text-muted-foreground mb-8">
        {articles.length} article{articles.length !== 1 ? 's' : ''} tagged with this topic.
      </p>

      <div className="flex flex-wrap gap-2 mb-12">
        {allTags.map((t) => (
          <Link
            key={t.tag_id}
            href={`/tag/${t.slug}`}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
              t.slug === slug
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            #{t.name}
          </Link>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/article/${article.slug}`}
            className="group"
          >
            <article className="space-y-3">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                {article.image ? (
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Image
                      src="/Hudyat-logo.svg"
                      alt=""
                      width={48}
                      height={48}
                      className="opacity-50"
                    />
                  </div>
                )}
              </div>
              <h2 className="font-display text-lg font-bold leading-tight group-hover:text-foreground/80 transition-colors line-clamp-2">
                {article.title}
              </h2>
              {article.excerpt && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {article.excerpt}
                </p>
              )}
              <p className="text-xs font-semibold text-muted-foreground">
                {article.author}
              </p>
            </article>
          </Link>
        ))}
      </div>
    </div>
  )
}
