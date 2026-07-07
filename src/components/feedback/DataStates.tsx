"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const ErrorState = ({
  title = "Something went wrong",
  message = "We couldn't load this section. Please try again.",
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) => {
  return (
    <div
      role="alert"
      className="flex flex-col items-start gap-3 rounded-md border border-destructive/30 bg-destructive/5 p-5 text-left"
    >
      <div className="flex items-center gap-2 text-destructive">
        <AlertCircle className="h-5 w-5" aria-hidden />
        <p className="text-sm font-semibold">{title}</p>
      </div>
      <p className="text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 focus-ring"
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden /> Try again
        </button>
      )}
    </div>
  );
};

export const LatestNewsSkeleton = () => (
  <div aria-busy="true" aria-live="polite">
    <Skeleton className="aspect-[16/10] w-full rounded-md" />
    <Skeleton className="mt-4 h-7 w-4/5" />
    <Skeleton className="mt-2 h-4 w-full" />
    <Skeleton className="mt-2 h-4 w-2/3" />
    <ul className="mt-6 divide-y divide-border border-t border-border">
      {[0, 1, 2].map((i) => (
        <li key={i} className="grid grid-cols-[112px_1fr] gap-4 py-4">
          <Skeleton className="aspect-square w-full rounded-md" />
          <div>
            <Skeleton className="h-3 w-16" />
            <Skeleton className="mt-2 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-3/4" />
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export const HeroSkeleton = () => (
  <div
    aria-busy="true"
    aria-live="polite"
    className="relative w-full h-[60vh] min-h-[420px] max-h-[640px] bg-muted overflow-hidden"
  >
    <Skeleton className="h-full w-full rounded-none" />
    <div className="absolute inset-x-0 bottom-0">
      <div className="container pb-10 md:pb-16 lg:pb-20">
        <div className="max-w-3xl space-y-4">
          <Skeleton className="h-5 w-24 bg-white/30" />
          <Skeleton className="h-10 w-full bg-white/30" />
          <Skeleton className="h-10 w-3/4 bg-white/30" />
          <Skeleton className="h-4 w-2/3 bg-white/20" />
        </div>
      </div>
    </div>
  </div>
);

export const EditorialSkeleton = () => (
  <div
    aria-busy="true"
    aria-live="polite"
    className="grid gap-6 lg:grid-cols-[1.5fr_1fr]"
  >
    <div className="rounded-2xl border-2 border-primary/20 bg-card overflow-hidden">
      <div className="grid h-full md:grid-cols-2">
        <Skeleton className="h-64 w-full rounded-none" />
        <div className="p-6 space-y-3">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-7 w-full" />
          <Skeleton className="h-7 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
    <div className="space-y-4">
      {[0, 1].map((i) => (
        <div key={i} className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  </div>
);

