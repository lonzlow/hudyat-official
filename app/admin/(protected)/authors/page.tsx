import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Notice } from "@/components/admin/Notice"
import { listAuthors } from "@/data/cms"
import { requireStaff } from "@/data/staff"
import { createAuthor, deleteAuthor, updateAuthor } from "@/lib/cms/manage-actions"

export const metadata = { title: "Authors" }

export default async function AuthorsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>
}) {
  await requireStaff("editor")
  const [sp, authors] = await Promise.all([searchParams, listAuthors()])

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="font-display text-3xl font-bold">Authors</h1>
      <p className="text-sm text-muted-foreground">Bylines shown on articles. Avatar: JPG, PNG or WebP, max 5 MB.</p>
      <Notice ok={sp.ok} error={sp.error} />

      <form action={createAuthor} className="flex flex-wrap items-end gap-2 rounded-md border bg-background p-3">
        <div className="min-w-48 flex-1 space-y-1">
          <Label htmlFor="new-name">New author</Label>
          <Input id="new-name" name="name" required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="new-avatar">Avatar</Label>
          <Input id="new-avatar" name="avatar" type="file" accept="image/jpeg,image/png,image/webp" />
        </div>
        <Button type="submit">Add author</Button>
      </form>

      <ul className="divide-y rounded-md border bg-background">
        {authors.length === 0 && <li className="p-6 text-center text-muted-foreground">No authors yet.</li>}
        {authors.map((a) => (
          <li key={a.author_id} className="flex flex-wrap items-center gap-3 p-3">
            {a.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={a.avatar_url} alt="" className="h-10 w-10 rounded-full object-cover" />
            ) : (
              <span className="h-10 w-10 rounded-full bg-muted" aria-hidden />
            )}
            <form action={updateAuthor} className="flex flex-1 flex-wrap items-center gap-2">
              <input type="hidden" name="id" value={a.author_id} />
              <Input name="name" defaultValue={a.author_name} aria-label="Author name" className="min-w-40 flex-1" required />
              <Input name="avatar" type="file" accept="image/jpeg,image/png,image/webp" aria-label="Replace avatar" className="max-w-56" />
              <Button type="submit" variant="outline">
                Save
              </Button>
            </form>
            <form action={deleteAuthor}>
              <input type="hidden" name="id" value={a.author_id} />
              <Button type="submit" variant="ghost" className="text-destructive">
                Delete
              </Button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  )
}
