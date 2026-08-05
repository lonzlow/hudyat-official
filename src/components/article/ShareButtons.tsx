"use client";

import { Share2, Link } from "lucide-react";
import { FaFacebook, FaXTwitter } from "react-icons/fa6";
import { SiGmail } from "react-icons/si";
import { toast } from "sonner";

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
  const url = typeof window !== "undefined" ? `${window.location.origin}/article/${slug}` : `/article/${slug}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
        Share
      </p>
      <div className="flex items-center gap-3">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Facebook"
          className="p-3 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <FaFacebook className="h-4 w-4" />
        </a>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Twitter"
          className="p-3 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <FaXTwitter className="h-4 w-4" />
        </a>
        <a
          href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`}
          aria-label="Share via Email"
          className="p-3 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <SiGmail className="h-4 w-4" />
        </a>
        <button
          onClick={handleCopyLink}
          aria-label="Copy link"
          className="p-3 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <Link className="h-4 w-4" />
        </button>
        {typeof navigator !== "undefined" && "share" in navigator && (
          <button
            onClick={handleWebShare}
            aria-label="Share"
            className="p-3 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors md:hidden"
          >
            <Share2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
