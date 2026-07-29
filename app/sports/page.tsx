import { FeatureRowCard } from "@/components/home/FeatureRowCard"
import { getContentsByType } from "@/data/contents"

export const dynamic = "force-dynamic"

export const metadata = { title: "Sports" }

export default async function SportsPage() {
  const { data: articles } = await getContentsByType(6, { limit: 50 })

  return (
    <div className="container py-12">
      <div className="mt-8 space-y-6">
        {articles.map((article, i) => (
          <FeatureRowCard key={article.id} s={article} index={i} />
        ))}
      </div>
    </div>
  )
}
