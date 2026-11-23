import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArticleForm } from "@/components/admin/ArticleForm"
import { Notice } from "@/components/admin/Notice"
import { getArticleForEdit, listAuthors, listTags } from "@/data/cms"
import { requireStaff } from "@/data/staff"
import { deleteArticle, unpublishArticle } from "@/lib/cms/article-actions"
import { parseParagraphs } from "@/lib/cms/paragraphs"

export const metadata = { title: "Edit article" }

export default async function EditArticlePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ ok?: string; error?: string }>
}) {
  const staff = await requireStaff()
  const { id: rawId } = await params
  const sp = await searchParams

  const id = Number(rawId)
  if (!Number.isInteger(id)) notFound()

  const [article, authors, tags] = await Promise.all([getArticleForEdit(id), listAuthors(), listTags()])
  if (!article) notFound()

  // Mirrors the database rules: writers can only change their own unpublished articles.
  const canEdit =
    staff.role === "editor" || (article.created_by === staff.userId && article.status !== "published")

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-3xl font-bold">Edit article</h1>
        <Badge variant={article.status === "published" ? "default" : "secondary"}>{article.status}</Badge>
      </div>

      <Notice ok={sp.ok} error={sp.error} />

      {canEdit ? (
        <ArticleForm
          key={article.content_id}
          articleId={article.content_id}
          status={article.status}
          role={staff.role}
          coverUrl={article.image_url}
          authors={authors}
          tags={tags}
          initial={{
            title: article.title,
            slug: article.slug,
            type_id: article.type_id,
            author_id: article.author_id,
            excerpt: article.excerpt ?? "",
            // Older articles stored as a JSON list are converted to plain paragraphs here.
            body: parseParagraphs(article.paragraph).join("\n\n"),
            date: article.date?.slice(0, 10) ?? "",
            image_id: article.image_id,
            tag_ids: article.tag_ids,
          }}
        />
      ) : (
        <p className="rounded-md border bg-background p-4 text-sm text-muted-foreground">
          This article is published, so only an editor can change it.{" "}
          <Link href={`/admin/preview/${article.content_id}`} className="underline">
            Preview it
          </Link>
          .
        </p>
      )}

      {staff.role === "editor" && (
        <div className="flex flex-wrap gap-3 border-t pt-6">
          {article.status === "published" && (
            <form action={unpublishArticle}>
              <input type="hidden" name="id" value={article.content_id} />
              <Button type="submit" variant="outline">
                Unpublish (back to draft)
              </Button>
            </form>
          )}
          <form action={deleteArticle}>
            <input type="hidden" name="id" value={article.content_id} />
            <Button type="submit" variant="destructive">
              Delete article
            </Button>
          </form>
        </div>
      )}
    </div>
  )
}
