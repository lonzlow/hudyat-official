import Image from "next/image";
import { Clock } from "lucide-react";
import type { ReactNode } from "react";

interface ArticleViewProps {
  title: string;
  author: string;
  date: string | null;
  imageUrl: string | null;
  excerpt: string | null;
  paragraphs: string[];
  /** Navigation shown above the title (public page: back / home links). */
  top?: ReactNode;
  /** Shown under the byline (public page: tag badges). */
  tags?: ReactNode;
  /** Shown after the body (public page: related articles and footer). */
  children?: ReactNode;
}

// Shared by the public article page and the CMS preview, so a draft previews exactly as it will publish.
export function ArticleView({
  title,
  author,
  date,
  imageUrl,
  excerpt,
  paragraphs,
  top,
  tags,
  children,
}: ArticleViewProps) {
  return (
    <div className="container max-w-4xl py-10 md:py-20">
      <header className="mb-12 space-y-8">
        {top}

        <h1 className="font-display text-4xl md:text-6xl font-bold mb-10">
          {title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 border-y py-8">
          <span className="text-sm font-black uppercase">By {author}</span>

          {date && (
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              <Clock className="h-4 w-4 text-primary" />
              {date}
            </span>
          )}
        </div>

        {tags}
      </header>

      {imageUrl ? (
        <div className="mb-6 rounded-lg overflow-hidden shadow-lg">
          <Image
            src={imageUrl}
            alt={title}
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

      {excerpt && (
        <p className="mb-12 text-sm text-muted-foreground italic border-l-4 border-primary/30 pl-4">
          {excerpt}
        </p>
      )}

      <div>
        {paragraphs.length > 0 ? (
          paragraphs.map((para, i) => (
            <p key={i} className="mb-10 text-lg md:text-xl leading-[1.9] font-serif">
              {para}
            </p>
          ))
        ) : (
          <p className="text-center text-muted-foreground py-20">
            This article has no content.
          </p>
        )}
      </div>

      {children}
    </div>
  );
}
