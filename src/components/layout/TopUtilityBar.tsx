"use client";

import { Search, Sun, Moon, Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface SearchResult {
  content_id: string;
  title: string;
  slug?: string;
  date?: string;
  images?: {
    image_link: string;
  } | null;
}

export const TopUtilityBar = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;

    const parts = text.split(
      new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"),
    );

    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark
              key={i}
              className="bg-primary/20 text-primary font-bold rounded-sm px-0.5 transition-colors"
            >
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          ),
        )}
      </span>
    );
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      setIsLoading(true);
      try {
        const selectFields = "content_id, title, slug, date, images(image_link)";
        let query = supabase.from("contents").select(selectFields).limit(5);

        if (searchQuery.trim()) {
          query = query.ilike("title", `%${searchQuery}%`);
        } else {
          query = query.order("date", { ascending: false });
        }

        const { data, error } = await query;
        if (error) throw error;
        setSuggestions(
          (data || []).map((item: any) => ({
            content_id: item.content_id,
            title: item.title,
            slug: item.slug,
            date: item.date,
            images: Array.isArray(item.images) ? item.images[0] : item.images,
          })),
        );
      } catch (error) {
        console.error("Search error:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      if (isOpen) fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-utility-bar text-utility-bar-foreground border-b border-border sticky top-0 z-50">
      <div className="container flex flex-col gap-2 py-2 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4 text-xs md:text-sm">
          <span className="font-bold tracking-widest uppercase text-white">
            New Era University
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div ref={searchRef} className="relative flex-1 md:w-80">
            <form
              role="search"
              className="relative"
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                  setIsOpen(false);
                }
              }}
            >
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsOpen(true)}
                className="h-9 pl-9 text-sm bg-background/50 focus:bg-background"
                autoComplete="off"
              />
            </form>

            {isOpen && (
              <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-popover border border-border rounded-xl shadow-2xl z-50 overflow-hidden">
                {isLoading ? (
                  <div className="px-4 py-10 text-center flex flex-col items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <p className="text-xs text-muted-foreground">
                      Searching...
                    </p>
                  </div>
                ) : suggestions.length > 0 ? (
                  <ul className="max-h-[380px] overflow-y-auto p-2">
                    {suggestions.map((result) => {
                      const imageUrl = result.images?.image_link;

                      return (
                        <li
                          key={result.content_id}
                          onClick={() => {
                            router.push(
                              `/article/${result.slug || result.content_id}`,
                            );
                            setIsOpen(false);
                          }}
                          className="group cursor-pointer rounded-lg hover:bg-accent transition-all mb-1 last:mb-0"
                        >
                          <article className="p-2">
                            <div
                              className={cn(
                                "grid gap-3 items-center",
                                imageUrl
                                  ? "grid-cols-[64px_1fr] md:grid-cols-[80px_1fr]"
                                  : "grid-cols-1",
                              )}
                            >
                              {imageUrl && (
                                <div className="aspect-square overflow-hidden rounded-md bg-muted">
                                  <img
                                    src={imageUrl}
                                    alt=""
                                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                  />
                                </div>
                              )}

                              <div className="flex flex-col min-w-0">
                                <h4 className="text-sm font-medium leading-tight text-foreground line-clamp-2 transition-colors">
                                  {highlightText(result.title, searchQuery)}
                                </h4>

                                {result.date && (
                                  <time className="text-[10px] text-muted-foreground mt-1 font-medium">
                                    {new Date(result.date).toLocaleDateString(
                                      undefined,
                                      {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                      },
                                    )}
                                  </time>
                                )}
                              </div>
                            </div>
                          </article>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="px-4 py-8 text-center text-xs text-muted-foreground">
                    No results for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {mounted ? (
              theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
