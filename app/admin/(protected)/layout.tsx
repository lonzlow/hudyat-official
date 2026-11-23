import Link from "next/link"
import { Button } from "@/components/ui/button"
import { requireStaff } from "@/data/staff"
import { signOut } from "../login/actions"

const EDITOR_LINKS = [
  { href: "/admin/tags", label: "Tags" },
  { href: "/admin/authors", label: "Authors" },
  { href: "/admin/videos", label: "Videos" },
  { href: "/admin/staff", label: "Staff" },
]

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const staff = await requireStaff()

  const links = [
    { href: "/admin", label: "Articles" },
    { href: "/admin/articles/new", label: "New article" },
    ...(staff.role === "editor" ? EDITOR_LINKS : []),
  ]

  return (
    <div className="min-h-screen bg-muted/30 md:flex">
      <aside className="flex flex-col gap-6 border-b bg-background p-5 md:min-h-screen md:w-60 md:border-b-0 md:border-r">
        <div>
          <p className="font-display text-xl font-bold">Hudyat CMS</p>
          <p className="mt-1 break-all text-xs text-muted-foreground">
            {staff.email} · {staff.role}
          </p>
        </div>

        <nav className="flex flex-wrap gap-1 md:flex-col" aria-label="CMS">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/"
            target="_blank"
            className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent"
          >
            View site ↗
          </Link>
        </nav>

        <form action={signOut} className="md:mt-auto">
          <Button type="submit" variant="outline" size="sm" className="w-full">
            Sign out
          </Button>
        </form>
      </aside>

      <main className="min-w-0 flex-1 p-5 md:p-10">{children}</main>
    </div>
  )
}
