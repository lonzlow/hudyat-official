import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Notice } from "@/components/admin/Notice"
import { listVideos } from "@/data/cms"
import { requireStaff } from "@/data/staff"
import { addVideo, deleteVideo, renameVideo } from "@/lib/cms/manage-actions"

export const metadata = { title: "Videos" }

export default async function VideosPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>
}) {
  await requireStaff("editor")
  const [sp, videos] = await Promise.all([searchParams, listVideos()])

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="font-display text-3xl font-bold">Videos</h1>
      <p className="text-sm text-muted-foreground">YouTube videos shown on the Newsroom page.</p>
      <Notice ok={sp.ok} error={sp.error} />

      <form action={addVideo} className="flex flex-wrap gap-2 rounded-md border bg-background p-3">
        <Input name="link" placeholder="https://www.youtube.com/watch?v=…" aria-label="YouTube link" className="min-w-64 flex-[2]" required />
        <Input name="name" placeholder="Title" aria-label="Video title" className="min-w-40 flex-1" />
        <Button type="submit">Add video</Button>
      </form>

      <ul className="divide-y rounded-md border bg-background">
        {videos.length === 0 && <li className="p-6 text-center text-muted-foreground">No videos yet.</li>}
        {videos.map((v) => (
          <li key={v.video_id} className="flex flex-wrap items-center gap-2 p-3">
            <form action={renameVideo} className="flex flex-1 flex-wrap items-center gap-2">
              <input type="hidden" name="id" value={v.video_id} />
              <Input name="name" defaultValue={v.video_name ?? ""} aria-label="Video title" placeholder="Title" className="min-w-40 flex-1" />
              <span className="max-w-60 truncate text-xs text-muted-foreground">{v.video_link}</span>
              <Button type="submit" variant="outline">
                Save
              </Button>
            </form>
            <form action={deleteVideo}>
              <input type="hidden" name="id" value={v.video_id} />
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
