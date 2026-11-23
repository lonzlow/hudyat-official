import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Notice } from "@/components/admin/Notice"
import { ADMIN_PAGE_SIZE, listArticles } from "@/data/cms"
import { TYPE_MAP } from "@/data/contents"
import { requireStaff } from "@/data/staff"
import type { ArticleStatus } from "@/lib/cms/schema"

export const metadata = { title: "Articles" }

const TABS: { label: string; status?: ArticleStatus }[] = [
  { label: "All" },
  { label: "Drafts", status: "draft" },
  { label: "In review", status: "review" },
  { label: "Published", status: "published" },
]

const STATUS_LABEL: Record<ArticleStatus, string> = { draft: "Draft", review: "In review", published: "Published" }

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string; q?: string; ok?: string; error?: string }>
}) {
  const staff = await requireStaff()
  const sp = await searchParams

  const status = TABS.find((t) => t.status === sp.status)?.status
  const page = Math.max(1, Number(sp.page) || 1)

  const { rows, count } = await listArticles({
    status,
    q: sp.q?.trim() || undefined,
    page,
    // Writers only see their own work here; editors see everything.
    createdBy: staff.role === "writer" ? staff.userId : undefined,
  })

  const pages = Math.max(1, Math.ceil(count / ADMIN_PAGE_SIZE))
  const href = (p: number) => {
    const q = new URLSearchParams()
    if (status) q.set("status", status)
    if (sp.q) q.set("q", sp.q)
    if (p > 1) q.set("page", String(p))
    return `/admin${q.size ? `?${q}` : ""}`
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold">Articles</h1>
        <Button asChild>
          <Link href="/admin/articles/new">New article</Link>
        </Button>
      </div>

      <Notice ok={sp.ok} error={sp.error} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav aria-label="Filter by status" className="flex gap-1">
          {TABS.map((t) => (
            <Link
              key={t.label}
              href={t.status ? `/admin?status=${t.status}` : "/admin"}
              aria-current={t.status === status ? "page" : undefined}
              className={`rounded-md px-3 py-1.5 text-sm ${
                t.status === status ? "bg-primary text-primary-foreground" : "hover:bg-accent"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </nav>

        <form action="/admin" className="flex gap-2">
          {status && <input type="hidden" name="status" value={status} />}
          <Input name="q" defaultValue={sp.q} placeholder="Search titles" className="w-56" aria-label="Search titles" />
          <Button type="submit" variant="outline">
            Search
          </Button>
        </form>
      </div>

      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Byline</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  No articles here yet.
                </TableCell>
              </TableRow>
            )}
            {rows.map((r) => (
              <TableRow key={r.content_id}>
                <TableCell className="max-w-md font-medium">
                  <Link href={`/admin/articles/${r.content_id}`} className="hover:underline">
                    {r.title}
                  </Link>
                </TableCell>
                <TableCell>{TYPE_MAP[r.type_id] ?? "—"}</TableCell>
                <TableCell>{r.author}</TableCell>
                <TableCell>
                  <Badge variant={r.status === "published" ? "default" : "secondary"}>{STATUS_LABEL[r.status]}</Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {r.updated_at.slice(0, 10)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Page {page} of {pages} · {count} articles
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Button asChild variant="outline" size="sm">
                <Link href={href(page - 1)}>Previous</Link>
              </Button>
            )}
            {page < pages && (
              <Button asChild variant="outline" size="sm">
                <Link href={href(page + 1)}>Next</Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
