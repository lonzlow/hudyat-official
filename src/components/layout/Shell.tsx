"use client";

import { ReactNode } from "react";
import { TopUtilityBar } from "./TopUtilityBar";
import { SiteHeader } from "./SiteHeader";
import { DateStrip } from "./DateStrip";
import { SiteFooter } from "./SiteFooter";

interface ShellProps {
  children: ReactNode;
}

export const Shell = ({ children }: ShellProps) => {
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
