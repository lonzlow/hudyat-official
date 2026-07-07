import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { getContentsByType } from "@/data/contents"

export const metadata = { title: "News" }

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const { q, page } = await searchParams
  const currentPage = parseInt(page || "1", 10)
  const pageSize = 9

  const { data: articles, count } = await getContentsByType(1, {
    page: currentPage,
    limit: pageSize,
    q,
  })

  const totalPages = count ? Math.ceil(count / pageSize) : 1

  return (
    <div className="container py-12">
      <h1 className="font-display text-4xl font-bold">News</h1>
      <form className="mt-6 flex gap-2">
        <Input name="q" placeholder="Search news..." defaultValue={q} />
        <Button type="submit">Search</Button>
      </form>
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Link key={article.id} href={`/article/${article.slug}`} className="group">
            <article className="space-y-2">
              {article.image && (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <Image src={article.image} alt={article.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" />
                </div>
              )}
              <h2 className="font-display text-lg font-bold group-hover:text-primary">{article.title}</h2>
              {article.excerpt && (
                <p className="text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
              )}
              <p className="text-sm text-muted-foreground">{article.author}</p>
            </article>
          </Link>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/news?page=${p}${q ? `&q=${q}` : ""}`}
              className={`px-3 py-1 rounded ${p === currentPage ? "bg-primary text-primary-foreground" : "bg-muted"}`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
