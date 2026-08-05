import Image from 'next/image'
import Link from 'next/link'
import { getRelatedArticles, TYPE_MAP } from '@/data/contents'

interface RelatedArticlesProps {
  currentSlug: string
  typeId: number
}

export async function RelatedArticles({ currentSlug, typeId }: RelatedArticlesProps) {
  const articles = await getRelatedArticles(currentSlug, typeId, 4)
  const categoryName = TYPE_MAP[typeId] || 'Articles'

  if (articles.length === 0) return null

  return (
    <section className="mt-20 pt-12 border-t">
      <h2 className="font-display text-2xl md:text-3xl font-bold mb-8">
        More in {categoryName}
      </h2>
      <div className="grid gap-6 md:grid-cols-2">
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
                    sizes="(max-width: 768px) 100vw, 50vw"
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
              <h3 className="font-display text-lg font-bold leading-tight group-hover:text-foreground/80 transition-colors line-clamp-2">
                {article.title}
              </h3>
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
    </section>
  )
}
