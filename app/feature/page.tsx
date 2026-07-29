import { FeatureRowCard } from "@/components/home/FeatureRowCard"
import { getContentsByType } from "@/data/contents"

export const dynamic = "force-dynamic"

export const metadata = { title: "Feature" }

export default async function FeaturePage() {
  const { data: articles } = await getContentsByType(2, { limit: 50 })

  return (
    <div className="container py-12">
      <h1 className="font-display text-4xl font-bold">Feature</h1>
      <div className="mt-8 space-y-6">
        {articles.map((article, i) => (
          <FeatureRowCard key={article.id} s={article} index={i} />
        ))}
      </div>
    </div>
  )
}
