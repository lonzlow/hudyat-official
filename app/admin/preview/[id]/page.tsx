import { notFound } from "next/navigation"
import { ArticleView } from "@/components/article/ArticleView"
import { getArticleForEdit } from "@/data/cms"
import { requireStaff } from "@/data/staff"
import { parseParagraphs } from "@/lib/cms/paragraphs"

export const metadata = { title: "Preview" }

export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  await requireStaff()
  const id = Number((await params).id)
  if (!Number.isInteger(id)) notFound()

  const article = await getArticleForEdit(id)
  if (!article) notFound()

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground">
        Preview · {article.status} · readers see this layout once it is published
      </div>
      <ArticleView
        title={article.title}
        author={article.author_name ?? "Hudyat Staff"}
        date={article.date}
        imageUrl={article.image_url}
        excerpt={article.excerpt}
        paragraphs={parseParagraphs(article.paragraph)}
      />
    </div>
  )
}
