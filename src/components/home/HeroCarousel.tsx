"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { NormalizedContent } from "@/data/contents";

const AUTOPLAY_MS = 6000;

export const HeroCarousel = ({ slides = [] }: { slides?: NormalizedContent[] }) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const count = slides.length;
  const goTo = useCallback(
    (i: number) => {
      if (count === 0) return;
      setIndex(((i % count) + count) % count);
    },
    [count],
  );
  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (paused || count === 0) return;
    intervalRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, AUTOPLAY_MS);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [paused, count]);

  if (count === 0) return null;

  return (
    <section
      className="relative w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative h-[60vh] min-h-[420px] max-h-[640px] w-full overflow-hidden bg-muted">
        {slides.map((slide, i) => {
          const isActive = i === index;
          return (
            <article
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                isActive
                  ? "opacity-100 z-10"
                  : "opacity-0 z-0 pointer-events-none"
              }`}
            >
                {slide.image?.trim() ? (
                <>
                  <Image
                    src={slide.image}
                    className="h-full w-full object-cover"
                    alt={slide.title}
                    fill
                    priority={i === 0}
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/40" />
                </>
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-hudyat-red via-hudyat-gold to-hudyat-teal opacity-90" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 container pb-12 md:pb-20">
                <div className="max-w-3xl">
                  <span className="inline-block bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-primary-foreground">
                    News
                  </span>
                  <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold leading-tight text-white mt-4">
                    <Link
                      href={`/article/${slide.slug}`}
                      className="hover:underline"
                    >
                      {slide.title}
                    </Link>
                  </h2>
                  <p className="mt-4 hidden md:block text-white/80 line-clamp-2 max-w-2xl">
                    {slide.excerpt}
                  </p>
                  <div className="mt-5 flex items-center gap-3 text-sm text-white/70">
                    <span className="font-semibold text-white">
                      By {slide.author}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          );
        })}

        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition flex items-center justify-center"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition flex items-center justify-center"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              className={`relative h-1.5 overflow-hidden rounded-full bg-white/30 transition-all ${i === index ? "w-10" : "w-5"}`}
            >
              {i === index && (
                <span
                  className={`absolute inset-y-0 left-0 bg-primary ${!paused ? "animate-[hero-progress_6s_linear_forwards]" : "w-full"}`}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
