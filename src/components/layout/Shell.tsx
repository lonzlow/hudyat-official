"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { TopUtilityBar } from "./TopUtilityBar";
import { SiteHeader } from "./SiteHeader";
import { DateStrip } from "./DateStrip";
import { SiteFooter } from "./SiteFooter";

interface ShellProps {
  children: ReactNode;
}

export const Shell = ({ children }: ShellProps) => {
  const pathname = usePathname();
  // The CMS has its own layout: no public header, date strip or footer.
  if (pathname.startsWith("/admin")) return <>{children}</>;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopUtilityBar />
      <SiteHeader />
      <DateStrip />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
};
