import Image from "next/image"
import Link from "next/link"
import { searchContents } from "@/data/contents"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Search",
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams

  if (!q?.trim()) {
    return (
      <div className="container py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Search</h1>
        <p className="mt-2 text-muted-foreground">Enter a search term to find articles.</p>
      </div>
    )
  }

  const results = await searchContents(q.trim())

  return (
    <div className="container py-12">
      <h1 className="font-display text-3xl font-bold">
        Search results for &ldquo;{q}&rdquo;
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {results.length} result{results.length !== 1 ? "s" : ""}
      </p>

      {results.length === 0 ? (
        <p className="mt-12 text-center text-muted-foreground">
          No articles found. Try a different search term.
        </p>
      ) : (
        <div className="mt-8 space-y-6">
          {results.map((item) => (
            <article key={item.id} className="border-b border-border pb-6">
              <Link href={`/article/${item.slug}`} className="group block">
                <div className="grid gap-4 md:grid-cols-[200px_1fr]">
                  {item.image && (
                    <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-muted">
                      <Image src={item.image} alt="" fill sizes="200px" className="object-cover transition-transform group-hover:scale-105" />
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {item.date && new Date(item.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <h2 className="mt-1 font-display text-xl font-bold leading-tight group-hover:text-foreground/80 transition-colors">
                      {item.title}
                    </h2>
                    {item.excerpt && (
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                        {item.excerpt}
                      </p>
                    )}
                    <p className="mt-2 text-xs font-medium text-muted-foreground">
                      By {item.author}
                    </p>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
