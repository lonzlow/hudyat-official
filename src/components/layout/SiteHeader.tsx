"use client";

import { useState, useRef, useEffect } from "react";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

const navItems = [
  { label: "Home", href: "/" },
  { label: "News", href: "/news" },
  { label: "Newsroom", href: "/newsroom" },
  { label: "Feature", href: "/feature" },
  { label: "Editorial", href: "/editorial" },
  { label: "Opinion", href: "/opinion" },
  { label: "Literary", href: "/literary" },
  { label: "Sports", href: "/sports" },
];

interface DropdownState {
  isOpen: boolean;
}

export const SiteHeader = () => {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<DropdownState>({
    isOpen: false,
  });
  const dropdownRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen({ isOpen: false });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-[50px] z-40 bg-background text-foreground border-b border-border">
      <div className="container flex items-center gap-6 py-4">
        {/* Logo + wordmark */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0"
          aria-label="Hudyat home"
        >
          <Image src="/Hudyat-logo.svg" alt="Hudyat" width={64} height={64} className="h-16 w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav
          aria-label="Primary"
          className="hidden lg:flex flex-1 justify-center"
        >
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-sm font-semibold uppercase tracking-wide text-foreground hover:text-primary transition-colors px-3 py-2"
                >
                  {item.label}
                </Link>
              </li>
            ))}

            <li>
              <Link
                href="/about"
                className="text-sm font-semibold uppercase tracking-wide text-foreground hover:text-primary transition-colors px-3 py-2"
              >
                About Us
              </Link>
            </li>
          </ul>
        </nav>

        {/* Right cluster */}
        <div className="ml-auto flex items-center gap-3">
          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-10 w-10"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle className="font-display text-2xl text-foreground">
                Hudyat
              </SheetTitle>
              <ul className="mt-6 flex flex-col gap-1">
                {navItems.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block px-3 py-3 text-base font-medium rounded-md hover:bg-muted hover:text-primary transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/about"
                    onClick={() => setOpen(false)}
                    className="block px-3 py-3 text-base font-medium rounded-md hover:bg-muted hover:text-primary transition-colors"
                  >
                    About Us
                  </Link>
                </li>
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
