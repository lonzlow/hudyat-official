import Link from 'next/link'
import { getTrendingArticles } from '@/data/views'
import { TrendingUp } from 'lucide-react'

export async function TrendingSection() {
  const articles = await getTrendingArticles(5)

  if (articles.length === 0) return null

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 border-b-2 border-primary pb-2">
        <TrendingUp className="h-4 w-4 text-primary" />
        <h2 className="font-display text-xl font-bold">Trending Now</h2>
      </div>
      <ol className="space-y-3">
        {articles.map((article, i) => (
          <li key={article.id}>
            <Link
              href={`/article/${article.slug}`}
              className="group flex items-start gap-3"
            >
              <span className="text-2xl font-black font-display text-muted-foreground/30 group-hover:text-primary/50 transition-colors leading-none mt-0.5 tabular-nums w-6 text-right">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0">
                <h3 className="text-sm font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-[11px] text-muted-foreground mt-1">
                  {article.author}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}
