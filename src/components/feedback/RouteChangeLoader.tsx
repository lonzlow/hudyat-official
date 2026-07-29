"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { LoadingFlip } from "@/components/feedback/LoadingFlip";

export const RouteChangeLoader = () => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (pathname !== prevPathname.current) {
      setLoading(true);
      prevPathname.current = pathname;

      const timer = setTimeout(() => setLoading(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm transition-opacity duration-300">
      <LoadingFlip size={320} />
    </div>
  );
};
