import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { FeatureRowCard } from "@/components/home/FeatureRowCard";
import { getHomepageCategoryGrids } from "@/data/contents";
import type { NormalizedContent } from "@/data/contents";

const categoryConfig = [
  { key: "features", title: "Feature", eyebrow: "In Depth", href: "/feature" },
  { key: "editorials", title: "Editorial", eyebrow: "The Board", href: "/editorial" },
  { key: "opinions", title: "Opinion", eyebrow: "Voices", href: "/opinion" },
  { key: "literary", title: "Literary", eyebrow: "Panitikan", href: "/literary" },
  { key: "sports", title: "Sports", eyebrow: "On the Court", href: "/sports" },
] as const;

const CategorySection = ({
  title,
  eyebrow,
  href,
  items,
}: {
  title: string;
  eyebrow: string;
  href: string;
  items: NormalizedContent[];
}) => {
  const sorted = [...items].sort((a, b) => {
    const aHasImage = !!a.image?.trim();
    const bHasImage = !!b.image?.trim();
    return Number(bHasImage) - Number(aHasImage);
  });

  const firstTwo = sorted.slice(0, 2);
  const lastOne = sorted.slice(2, 3);

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between gap-4 border-b-2 border-primary pb-2 mb-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-primary/80">
            {eyebrow}
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-bold leading-tight text-foreground">
            {title}
          </h2>
        </div>
        {sorted.length > 2 && (
          <Link
            href={href}
            className="shrink-0 pb-1 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary hover:opacity-70 transition-opacity"
          >
            View All <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {firstTwo.map((item, i) => (
          <FeatureRowCard key={item.id} s={item} index={i} />
        ))}
      </div>
      <div className="space-y-6">
        {lastOne.map((item, i) => (
          <FeatureRowCard
            key={item.id}
            s={item}
            index={i + 2}
            hideImage={!item.image?.trim()}
          />
        ))}
      </div>
    </section>
  );
};

export async function CategorySections() {
  const grids = await getHomepageCategoryGrids();

  return (
    <div className="space-y-16">
      <div className="pb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-primary/80">
          Browse
        </p>
        <h2 className="font-display text-4xl md:text-5xl font-black text-foreground">
          Categories
        </h2>
      </div>
      {categoryConfig.map(({ key, title, eyebrow, href }) => (
        <CategorySection
          key={key}
          title={title}
          eyebrow={eyebrow}
          href={href}
          items={grids[key]}
        />
      ))}
    </div>
  );
}