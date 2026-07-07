import { HeroCarousel } from "@/components/home/HeroCarousel"
import { LatestNews } from "@/components/home/LatestNews"
import { Newsroom } from "@/components/home/Newsroom"
import { CategorySections } from "@/components/home/CategorySections"
import { getLatestNews } from "@/data/contents"
import { getVideos } from "@/data/videos"

export default async function HomePage() {
  const [latestNews, videos] = await Promise.all([
    getLatestNews(9),
    getVideos(),
  ])

  return (
    <>
      <HeroCarousel slides={latestNews.slice(0, 3)} />

      <section className="container py-8 md:py-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-12">
          <LatestNews items={latestNews} />
          <Newsroom videos={videos} />
        </div>
      </section>

      <section className="container pb-16 md:pb-20">
        <CategorySections />
      </section>
    </>
  )
}
