import { ArticleForm } from "@/components/admin/ArticleForm"
import { listAuthors, listTags } from "@/data/cms"
import { requireStaff } from "@/data/staff"

export const metadata = { title: "New article" }

export default async function NewArticlePage() {
  const staff = await requireStaff()
  const [authors, tags] = await Promise.all([listAuthors(), listTags()])

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="font-display text-3xl font-bold">New article</h1>
      <ArticleForm
        articleId={null}
        status="draft"
        role={staff.role}
        coverUrl={null}
        authors={authors}
        tags={tags}
        initial={{
          title: "",
          slug: "",
          type_id: 1,
          // Writers start with their own byline.
          author_id: staff.authorId,
          excerpt: "",
          body: "",
          date: "",
          image_id: null,
          tag_ids: [],
        }}
      />
    </div>
  )
}
