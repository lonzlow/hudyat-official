"use client";

import { useState, useRef, useEffect, useId } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

export interface YouTubeFacadeProps {
  videoId: string;
  title: string;
  posterUrl?: string;
  duration?: string;
  regionLabel?: string;
  className?: string;
  children?: React.ReactNode;
  autoplayOnActivate?: boolean;
  playButtonSize?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-12 w-12",
  md: "h-16 w-16",
  lg: "h-20 w-20",
} as const;

const iconSizeClasses = {
  sm: "h-5 w-5",
  md: "h-7 w-7",
  lg: "h-9 w-9",
} as const;

export const YouTubeFacade = ({
  videoId,
  title,
  posterUrl,
  duration,
  regionLabel,
  className,
  children,
  autoplayOnActivate = true,
  playButtonSize = "md",
}: YouTubeFacadeProps) => {
  const [activated, setActivated] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const labelId = useId();

  const fallbackPoster = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  const poster = posterUrl ?? fallbackPoster;

  useEffect(() => {
    if (activated && iframeRef.current) {
      iframeRef.current.focus();
    }
  }, [activated]);

  const embedSrc = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1${
    autoplayOnActivate ? "&autoplay=1" : ""
  }`;

  const computedRegionLabel = regionLabel ?? `Video player: ${title}`;

  return (
    <div
      role="region"
      aria-label={computedRegionLabel}
      className={cn(
        "relative overflow-hidden rounded-md bg-muted isolate",
        className,
      )}
    >
      <span id={labelId} className="sr-only">
        {title}
      </span>

      {!activated ? (
        <button
          type="button"
          onClick={() => setActivated(true)}
          aria-label={`Play video: ${title}`}
          aria-describedby={labelId}
          className="group relative block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md"
        >
          <img
            src={poster}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              const img = e.currentTarget;
              if (!img.dataset.fallback) {
                img.dataset.fallback = "1";
                img.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
              }
            }}
            className="aspect-video w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          <span
            aria-hidden="true"
            className={cn("absolute inset-0 flex items-center justify-center")}
          >
            <span
              className={cn(
                "flex items-center justify-center rounded-full bg-primary/95 text-primary-foreground shadow-lg ring-4 ring-white/20 motion-safe:transition-transform motion-safe:group-hover:scale-110",
                sizeClasses[playButtonSize],
              )}
            >
              <Play
                className={cn(
                  "fill-current ml-1",
                  iconSizeClasses[playButtonSize],
                )}
              />
            </span>
          </span>

          {duration ? (
            <span className="absolute bottom-3 right-3 bg-black/80 text-white text-xs font-mono px-2 py-0.5 rounded">
              {duration}
            </span>
          ) : null}

          {children ? (
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              {children}
            </div>
          ) : null}
        </button>
      ) : (
        <iframe
          ref={iframeRef}
          src={embedSrc}
          title={title}
          aria-label={title}
          tabIndex={0}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          className="aspect-video w-full border-0"
        />
      )}
    </div>
  );
};

export default YouTubeFacade;
