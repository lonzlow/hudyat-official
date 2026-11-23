import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Notice } from "@/components/admin/Notice"
import { listTags } from "@/data/cms"
import { requireStaff } from "@/data/staff"
import { createTag, deleteTag, updateTag } from "@/lib/cms/manage-actions"

export const metadata = { title: "Tags" }

export default async function TagsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>
}) {
  await requireStaff("editor")
  const [sp, tags] = await Promise.all([searchParams, listTags()])

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="font-display text-3xl font-bold">Tags</h1>
      <Notice ok={sp.ok} error={sp.error} />

      <form action={createTag} className="flex gap-2">
        <Input name="name" placeholder="New tag name" aria-label="New tag name" required />
        <Button type="submit">Add tag</Button>
      </form>

      <ul className="divide-y rounded-md border bg-background">
        {tags.length === 0 && <li className="p-6 text-center text-muted-foreground">No tags yet.</li>}
        {tags.map((t) => (
          <li key={t.tag_id} className="flex flex-wrap items-center gap-2 p-3">
            <form action={updateTag} className="flex flex-1 flex-wrap gap-2">
              <input type="hidden" name="id" value={t.tag_id} />
              <Input name="name" defaultValue={t.name} aria-label="Tag name" className="min-w-40 flex-1" required />
              <Input name="slug" defaultValue={t.slug} aria-label="Tag slug" className="min-w-40 flex-1" required />
              <Button type="submit" variant="outline">
                Save
              </Button>
            </form>
            <form action={deleteTag}>
              <input type="hidden" name="id" value={t.tag_id} />
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
