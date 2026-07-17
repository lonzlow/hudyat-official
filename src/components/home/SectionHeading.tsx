"use client";

import { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
}

export const SectionHeading = ({ eyebrow, title, action }: SectionHeadingProps) => {
  return (
    <div className="flex items-end justify-between gap-4 border-b-2 border-primary pb-2 mb-5">
      <div>
        {eyebrow && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-2xl md:text-3xl font-bold leading-tight text-foreground">
          {title}
        </h2>
      </div>
      {action && <div className="shrink-0 pb-1">{action}</div>}
    </div>
  );
};
