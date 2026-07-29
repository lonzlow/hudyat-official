import { YouTubeFacade } from "@/components/media/YouTubeFacade"
import { getVideos, type NormalizedVideo } from "@/data/videos"

export const dynamic = "force-dynamic"

export const metadata = { title: "Newsroom" }

export default async function NewsroomPage() {
  const videos = await getVideos()
  const validVideos = videos.filter((v): v is NormalizedVideo & { youtubeId: string } => !!v.youtubeId)

  return (
    <div className="container py-12">
      <h1 className="font-display text-4xl font-bold">Newsroom</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {validVideos.map((video) => (
          <YouTubeFacade key={video.id} videoId={video.youtubeId} title={video.title} />
        ))}
      </div>
    </div>
  )
}


