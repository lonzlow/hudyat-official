import Link from 'next/link'
import Image from 'next/image'
import { getArchiveYears, getArticlesByYear } from '@/data/contents'

export const dynamic = "force-dynamic"

export const metadata = { title: "Archive" }

export default async function ArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string }>
}) {
  const { year } = await searchParams
  const years = await getArchiveYears()
  const selectedYear = year ? parseInt(year, 10) : (years[0]?.year || null)
  const articles = selectedYear ? await getArticlesByYear(selectedYear) : []

  return (
    <div className="container py-12">
      <h1 className="font-display text-4xl font-bold mb-2">Archive</h1>
      <p className="text-muted-foreground mb-8">
        Browse articles by year.
      </p>

      <div className="flex flex-wrap gap-2 mb-12">
        {years.map((y) => (
          <Link
            key={y.year}
            href={`/archive?year=${y.year}`}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              selectedYear === y.year
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {y.year} ({y.count})
          </Link>
        ))}
      </div>

      {articles.length > 0 ? (
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
      ) : (
        <p className="text-center text-muted-foreground py-20">
          No articles found for this year.
        </p>
      )}
    </div>
  )
}
