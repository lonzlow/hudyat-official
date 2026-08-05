import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, House, Clock } from "lucide-react";
import { getContentBySlug } from "@/data/contents";
import { notFound } from "next/navigation";
import { BackButton } from "./BackButton";
import { ShareButtons } from "@/components/article/ShareButtons";
import { RelatedArticles } from "@/components/article/RelatedArticles";
import { TagBadges } from "@/components/article/TagBadges";
import { ViewTracker } from "@/components/article/ViewTracker";
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

  const imageUrl = hasValidImage ? article.image : null;
  const date = hasValidDate ? article.date : null;

  const parsedParagraphs = (() => {
    const rawData = article.paragraph;
    if (!rawData) return [];

    if (Array.isArray(rawData)) return rawData;

    if (typeof rawData === "string") {
      const trimmed = rawData.trim();

      if (trimmed.startsWith("[")) {
        try {
          const parsed = JSON.parse(trimmed);
          return Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          return trimmed
            .replace(/^\[|\]$/g, "")
            .split('", "')
            .map((p) => p.replace(/^"|"$/g, "").trim())
            .filter(Boolean);
        }
      }

      return trimmed.split(/\n+/).filter(Boolean);
    }

    return [];
  })();

  return (
    <article className="bg-background min-h-screen">
      <ViewTracker contentId={article.id} />
      <div className="container max-w-4xl py-10 md:py-20">
        <header className="mb-12 space-y-8">
          <div className="flex gap-4 items-center">
            <BackButton />

            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
              <House className="h-4 w-4" /> Home
            </Link>
          </div>

          <h1 className="font-display text-4xl md:text-6xl font-bold mb-10">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 border-y py-8">
            <span className="text-sm font-black uppercase">
              By {article.author}
            </span>

            {date && (
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                <Clock className="h-4 w-4 text-primary" />
                {date}
              </span>
            )}
          </div>

          <TagBadges contentId={article.id} />
        </header>

        {imageUrl ? (
          <div className="mb-6 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={imageUrl}
              alt={article.title}
              width={1200}
              height={675}
              className="w-full h-auto object-cover max-h-96"
              unoptimized
            />
          </div>
        ) : (
          <div className="mb-6 rounded-lg overflow-hidden shadow-lg bg-muted flex items-center justify-center h-64 md:h-80">
            <Image
              src="/Hudyat-logo.svg"
              alt="Hudyat"
              width={120}
              height={120}
              className="opacity-50"
            />
          </div>
        )}

        {article.excerpt && (
          <p className="mb-12 text-sm text-muted-foreground italic border-l-4 border-primary/30 pl-4">
            {article.excerpt}
          </p>
        )}

        <div>
          {parsedParagraphs.length > 0 ? (
            parsedParagraphs.map((para, i) => (
              <p
                key={i}
                className="mb-10 text-lg md:text-xl leading-[1.9] font-serif"
              >
                {para}
              </p>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-20">
              This article has no content.
            </p>
          )}
        </div>

        <RelatedArticles currentSlug={article.slug} typeId={article.type_id} />

        <footer className="mt-24 pt-12 border-t flex flex-col items-center gap-10">
          <ShareButtons title={article.title} slug={article.slug} />

          <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
            End of Story
          </p>

          <BackButton />
        </footer>
      </div>
    </article>
  );
}
