import { Button } from "@/components/ui/button"
import { Notice } from "@/components/admin/Notice"
import { listAuthors, listStaff } from "@/data/cms"
import { requireStaff } from "@/data/staff"
import { updateStaff } from "@/lib/cms/manage-actions"

export const metadata = { title: "Staff" }

const selectClass = "h-10 rounded-md border border-input bg-background px-3 text-sm"

export default async function StaffPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>
}) {
  const me = await requireStaff("editor")
  const [sp, staff, authors] = await Promise.all([searchParams, listStaff(), listAuthors()])

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="font-display text-3xl font-bold">Staff</h1>
      <p className="text-sm text-muted-foreground">
        Writers can draft and submit articles; editors can publish and manage everything. To add someone, invite
        them in the Supabase dashboard, then add a row to the staff table (see supabase/README.md).
      </p>
      <Notice ok={sp.ok} error={sp.error} />

      <ul className="divide-y rounded-md border bg-background">
        {staff.map((s) => (
          <li key={s.user_id} className="p-3">
            <form action={updateStaff} className="flex flex-wrap items-center gap-2">
              <input type="hidden" name="user_id" value={s.user_id} />
              <span className="min-w-48 flex-1 break-all text-sm font-medium">
                {s.email ?? s.user_id}
                {s.user_id === me.userId && <span className="ml-2 text-xs text-muted-foreground">(you)</span>}
              </span>
              <select name="role" defaultValue={s.role} aria-label="Role" className={selectClass}>
                <option value="writer">Writer</option>
                <option value="editor">Editor</option>
              </select>
              <select name="author_id" defaultValue={s.author_id ?? ""} aria-label="Byline" className={selectClass}>
                <option value="">No byline</option>
                {authors.map((a) => (
                  <option key={a.author_id} value={a.author_id}>
                    {a.author_name}
                  </option>
                ))}
              </select>
              <Button type="submit" variant="outline">
                Save
              </Button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  )
}
