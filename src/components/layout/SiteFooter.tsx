import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { SiGmail } from "react-icons/si";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "News", href: "/news" },
  { label: "Newsroom", href: "/newsroom" },
  { label: "Feature", href: "/feature" },
  { label: "Editorial", href: "/editorial" },
  { label: "Opinion", href: "/opinion" },
  { label: "Literary", href: "/literary" },
  { label: "Sports", href: "/sports" },
  { label: "Archive", href: "/archive" },
  { label: "About", href: "/about" },
];

export const SiteFooter = () => {
  return (
    <footer className="bg-banner text-banner-foreground mt-16">
      <div className="container py-12 grid gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/Hudyat-logo.svg" alt="Hudyat" width={96} height={96} className="h-24 w-auto" />
            <div>
              <p className="text-xs uppercase tracking-widest opacity-80">
                NEU Student Publication
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm opacity-90 leading-relaxed">
            Your gateway to campus life — articles, opinion, art, and the
            stories that shape New Era University.
          </p>
        </div>

        <div>
          <h2 className="font-display text-lg font-bold mb-4">Quick Links</h2>
          <ul className="grid grid-cols-2 gap-2 text-sm">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="hover:text-accent transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-lg font-bold mb-4">Connect</h2>
          <div className="flex items-center gap-3">
            <a
              href="https://www.facebook.com/share/1GQhBzCrR1/"
              aria-label="Facebook"
              className="p-2 rounded-full bg-banner-muted hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <FaFacebook className="h-4 w-4" />
            </a>
            <a
              href="https://www.instagram.com/neu_hudyat?igsh=MXFud3A1dmExdzJwaQ=="
              aria-label="Instagram"
              className="p-2 rounded-full bg-banner-muted hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <FaInstagram className="h-4 w-4" />
            </a>
            <a
              href="https://youtube.com/@neuhudyat?si=LPaydMfWIfXvngSs"
              aria-label="YouTube"
              className="p-2 rounded-full bg-banner-muted hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <FaYoutube className="h-4 w-4" />
            </a>
            <a
              href="mailto:hudyat@neu.edu.ph"
              aria-label="Email"
              className="p-2 rounded-full bg-banner-muted hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <SiGmail className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-banner-muted">
        <div className="container py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs opacity-80">
          <p>
            &copy; {new Date().getFullYear()} Hudyat &middot; The Official Student Publication of New Era
            University
          </p>
        </div>
      </div>
    </footer>
  );
};
