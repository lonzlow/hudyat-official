import Link from "next/link";
import { House } from "lucide-react";
import { getContentBySlug } from "@/data/contents";
import { notFound } from "next/navigation";
import { BackButton } from "./BackButton";
import { ShareButtons } from "@/components/article/ShareButtons";
import { RelatedArticles } from "@/components/article/RelatedArticles";
import { TagBadges } from "@/components/article/TagBadges";
import { ViewTracker } from "@/components/article/ViewTracker";
import { ArticleView } from "@/components/article/ArticleView";
import { parseParagraphs } from "@/lib/cms/paragraphs";
import type { Metadata } from "next";

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getContentBySlug(slug)
  if (!article) return { title: "Article Not Found" }
  return {
    title: article.title,
    description: article.excerpt || undefined,
    openGraph: {
      title: article.title,
      description: article.excerpt || undefined,
      type: "article",
      ...(article.image ? { images: [{ url: article.image }] } : {}),
    },
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params
  const article = await getContentBySlug(slug)

  if (!article) {
    notFound()
  }

  const hasValidImage =
    article.image &&
    typeof article.image === "string" &&
    article.image.trim() !== "" &&
    article.image !== "/images/hudyatplaceholder.webp";

  const hasValidDate =
    article.date != null &&
    typeof article.date === "string" &&
    article.date.trim() !== "" &&
    article.date.toLowerCase() !== "invalid";

  return (
    <article className="bg-background min-h-screen">
      <ViewTracker contentId={article.id} />
      <ArticleView
        title={article.title}
        author={article.author}
        date={hasValidDate ? article.date : null}
        imageUrl={hasValidImage ? article.image : null}
        excerpt={article.excerpt}
        paragraphs={parseParagraphs(article.paragraph)}
        top={
          <div className="flex gap-4 items-center">
            <BackButton />

            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
              <House className="h-4 w-4" /> Home
            </Link>
          </div>
        }
        tags={<TagBadges contentId={article.id} />}
      >
        <RelatedArticles currentSlug={article.slug} typeId={article.type_id} />

        <footer className="mt-24 pt-12 border-t flex flex-col items-center gap-10">
          <ShareButtons title={article.title} slug={article.slug} />

          <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
            End of Story
          </p>

          <BackButton />
        </footer>
      </ArticleView>
    </article>
  );
}
