"use client";

import Link from "next/link";

interface RichTextNode {
  type: string;
  text?: string;
  href?: string;
}

interface ContentBlock {
  type: string;
  level?: number;
  text?: string;
  nodes?: RichTextNode[];
  src?: string;
  alt?: string;
  caption?: string;
  cite?: string;
  ordered?: boolean;
  items?: string[];
}

const renderNodes = (nodes: RichTextNode[]) =>
  nodes.map((n, i) => {
    if (n.type === "link") {
      const isExternal = /^https?:\/\//.test(n.href || "");
      if (isExternal) {
        return (
          <a
            key={i}
            href={n.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary focus-ring"
          >
            {n.text}
          </a>
        );
      }
      return (
        <Link
          key={i}
          href={n.href || "#"}
          className="text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary focus-ring"
        >
          {n.text}
        </Link>
      );
    }
    return <span key={i}>{n.text}</span>;
  });

export const RichContent = ({ blocks }: { blocks: ContentBlock[] }) => {
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading": {
            const Tag = block.level === 2 ? "h2" : "h3";
            const sizing =
              block.level === 2
                ? "font-display text-2xl md:text-3xl font-bold mt-8"
                : "font-display text-xl md:text-2xl font-bold mt-6";
            return (
              <Tag
                key={i}
                className={`${sizing} text-foreground leading-tight`}
              >
                {block.text}
              </Tag>
            );
          }
          case "paragraph":
            return (
              <p
                key={i}
                className="text-base md:text-lg leading-relaxed text-foreground"
              >
                {renderNodes(block.nodes || [])}
              </p>
            );
          case "image":
            return (
              <figure key={i} className="my-2">
                <div className="overflow-hidden rounded-lg bg-muted">
                  <img
                    src={block.src}
                    alt={block.alt || ""}
                    loading="lazy"
                    className="w-full h-auto object-cover"
                  />
                </div>
                {block.caption && (
                  <figcaption className="mt-2 text-xs md:text-sm text-muted-foreground italic">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );
          case "quote":
            return (
              <blockquote
                key={i}
                className="border-l-4 border-primary bg-muted/40 pl-5 pr-4 py-4 my-2 rounded-r-md"
              >
                <p className="font-display text-xl md:text-2xl italic leading-snug text-foreground">
                  &ldquo;{block.text}&rdquo;
                </p>
                {block.cite && (
                  <cite className="mt-3 block text-sm not-italic text-muted-foreground">
                    — {block.cite}
                  </cite>
                )}
              </blockquote>
            );
          case "list": {
            const Tag = block.ordered ? "ol" : "ul";
            const listClass = block.ordered ? "list-decimal" : "list-disc";
            return (
              <Tag
                key={i}
                className={`${listClass} pl-6 space-y-2 text-base md:text-lg leading-relaxed text-foreground marker:text-primary`}
              >
                {(block.items || []).map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </Tag>
            );
          }
          default:
            return null;
        }
      })}
    </div>
  );
};
