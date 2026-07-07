"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "./SectionHeading";
import { FeatureRowCard } from "./FeatureRowCard";
import type { NormalizedContent } from "@/data/contents";

export const LatestNews = ({ items = [] }: { items?: NormalizedContent[] }) => {
  const sortedItems = [...items].slice(0, 3).sort((a, b) => {
    const aHasImage = !!a.image?.trim();
    const bHasImage = !!b.image?.trim();
    return Number(bHasImage) - Number(aHasImage);
  });

  return (
    <section aria-labelledby="latest-news">
      <SectionHeading
        eyebrow="The Hudyat Brief"
        title="Latest News"
        action={
          <Link
            href="/news"
            className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        }
      />

      <div className="space-y-6">
        {sortedItems.map((item, i) => (
          <FeatureRowCard
            key={item.id}
            s={item}
            index={i}
            hideImage={!item.image?.trim()}
          />
        ))}
      </div>

      {items.length > 3 && (
        <div className="mt-6">
          <Link
            href="/news"
            className="w-full block text-center px-4 py-3 border border-primary/30 rounded-md font-semibold text-primary hover:bg-primary/5 transition-colors"
          >
            View More Articles
          </Link>
        </div>
      )}
    </section>
  );
};
