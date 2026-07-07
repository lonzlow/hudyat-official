"use client";

import { useEffect, useState } from "react";
import { LoadingFlip } from "@/components/feedback/LoadingFlip";

export const SplashScreen = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative">
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-500 ${
          show ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <LoadingFlip text="Hudyat" size={160} />
      </div>
      {children}
    </div>
  );
};
