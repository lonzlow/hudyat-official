"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LoadingFlip } from "@/components/feedback/LoadingFlip";

export const SplashScreen = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [show, setShow] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Staff do not need the 3-second splash on every CMS page load.
  if (pathname.startsWith("/admin")) return <>{children}</>;

  return (
    <div className="relative">
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-500 ${
          show ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <LoadingFlip size={320} />
      </div>
      {children}
    </div>
  );
};
