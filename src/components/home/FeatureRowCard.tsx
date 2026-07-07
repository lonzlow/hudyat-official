"use client";

import Image from "next/image";
import Link from "next/link";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureRowCardProps {
  s: {
    id: string | number;
    slug?: string;
    title: string;
    image: string;
    author: string;
    date: string | null;
    excerpt: string | null;
  };
  index?: number;
  hideImage?: boolean;
}

export const FeatureRowCard = ({
  s,
  index = 0,
  hideImage = false,
}: FeatureRowCardProps) => {
  const hasImage = !hideImage && !!s.image?.trim();

  return (
    <article
      className={cn(
        "group relative rounded-2xl border border-border bg-card shadow-sm overflow-hidden",
        "transition-all duration-300 hover:shadow-lg hover:border-primary/40",
        "motion-safe:animate-fade-in-up",
      )}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div
        className={cn(
          "grid gap-0 h-full",
          hasImage ? "grid-cols-1 md:grid-cols-[40%_1fr]" : "grid-cols-1",
        )}
      >
        {hasImage && (
          <div className="relative overflow-hidden w-full h-48 md:h-full bg-black">
            <Image
              src={s.image}
              alt={s.title}
              fill
              className="absolute inset-0 h-full w-full object-cover scale-125 blur-md opacity-40"
              unoptimized
            />
            <Image
              src={s.image}
              alt={s.title}
              fill
              className="relative z-10 h-full w-full object-contain transition-transform duration-700 group-hover:scale-105"
              unoptimized
            />
          </div>
        )}

        <div className="flex flex-col p-5 h-full">
          <Link href={`/article/${s.slug || s.id}`}>
            <h3 className="font-display text-lg md:text-xl font-bold leading-tight text-primary group-hover:text-primary/85 transition-colors line-clamp-2 mb-3">
              {s.title}
            </h3>
          </Link>

          {s.excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {s.excerpt}
            </p>
          )}

          <div className="mt-auto pt-3 border-t border-border flex items-center justify-between gap-2">
            <div className="flex flex-col gap-1 min-w-0">
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground">
                <User className="h-3 w-3 text-muted-foreground" />
                <span className="truncate">{s.author || "Hudyat Staff"}</span>
              </span>
            </div>

            <Link
              href={`/article/${s.slug || s.id}`}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Read
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};
