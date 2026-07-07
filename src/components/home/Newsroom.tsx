"use client";

import Link from "next/link";
import { SectionHeading } from "./SectionHeading";
import { YouTubeFacade } from "@/components/media/YouTubeFacade";
import { useState } from "react";
import type { NormalizedVideo } from "@/data/videos";

export const Newsroom = ({ videos = [] }: { videos?: NormalizedVideo[] }) => {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const validVideos = videos.filter((v): v is NormalizedVideo & { youtubeId: string } => !!v.youtubeId);

  const orderedVideos = activeVideoId
    ? [
        validVideos.find((v) => v.youtubeId === activeVideoId),
        ...validVideos.filter((v) => v.youtubeId !== activeVideoId),
      ].filter((v): v is NormalizedVideo & { youtubeId: string } => !!v)
    : validVideos;

  const featuredVideo = orderedVideos[0];
  const playlist = orderedVideos.slice(1, 3);

  if (videos.length === 0) {
    return (
      <section aria-labelledby="newsroom">
        <SectionHeading eyebrow="Watch" title="Hudyat Newsroom" />
        <div className="aspect-video bg-muted animate-pulse rounded-md" />
      </section>
    );
  }

  return (
    <section aria-labelledby="newsroom">
      <SectionHeading
        eyebrow="Watch"
        title="Hudyat Newsroom"
      />

      {featuredVideo && (
        <article className="mb-6">
          <div
            onClick={() => setActiveVideoId(featuredVideo.youtubeId)}
            className="relative aspect-video cursor-pointer overflow-hidden rounded-md"
          >
            <YouTubeFacade
              key={`featured-${featuredVideo.youtubeId}`}
              videoId={featuredVideo.youtubeId}
              title={featuredVideo.title}
              playButtonSize="lg"
              regionLabel={`Featured video: ${featuredVideo.title}`}
            />
          </div>
        </article>
      )}

      {playlist.length > 0 && (
        <ul className="mt-5 space-y-3">
          {playlist.map((v) => (
            <li key={v.id}>
              <div className="grid grid-cols-[120px_1fr] sm:grid-cols-[140px_1fr] gap-3 items-start">
                <div
                  onClick={() => setActiveVideoId(v.youtubeId)}
                  className="relative h-[70px] cursor-pointer overflow-hidden rounded"
                >
                  <YouTubeFacade
                    key={`playlist-${v.youtubeId}`}
                    videoId={v.youtubeId}
                    title={v.title}
                    playButtonSize="sm"
                    regionLabel={`Video: ${v.title}`}
                  />
                </div>

                <div className="min-w-0">
                  <h4 className="font-display text-sm md:text-base font-bold leading-snug text-foreground line-clamp-2">
                    {v.title}
                  </h4>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {activeVideoId && (
        <button
          onClick={() => setActiveVideoId(null)}
          className="mt-4 text-xs font-semibold text-muted-foreground hover:text-primary transition"
        >
          Stop all videos
        </button>
      )}

      <Link
        href="/newsroom"
        className="mt-5 block text-center text-xs font-semibold uppercase tracking-wider text-primary hover:text-primary/80 border border-primary/30 hover:border-primary py-2.5 rounded-md transition-colors"
      >
        Visit the Newsroom
      </Link>
    </section>
  );
};
