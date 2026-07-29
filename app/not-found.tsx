import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-background text-foreground min-h-[70vh] px-4">
      <div className="max-w-md mx-auto text-center space-y-8">
        <Image
          src="/Hudyat-logo.svg"
          alt="Hudyat"
          width={96}
          height={96}
          className="mx-auto h-24 w-auto opacity-60"
        />

        <div className="space-y-2">
          <p className="text-xl text-muted-foreground max-w-sm mx-auto">
            The page you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>

        <div className="relative max-w-sm mx-auto">
          <input
            type="text"
            placeholder="Search articles..."
            className="w-full px-4 py-3 rounded-lg bg-muted text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
          />
        </div>

        <div className="flex items-center justify-center gap-6 text-sm font-medium">
          <Link
            href="/"
            className="text-primary underline underline-offset-4 hover:opacity-70 transition-opacity"
          >
            Home
          </Link>
          <Link
            href="/news"
            className="text-primary underline underline-offset-4 hover:opacity-70 transition-opacity"
          >
            News
          </Link>
          <Link
            href="/about"
            className="text-primary underline underline-offset-4 hover:opacity-70 transition-opacity"
          >
            About
          </Link>
        </div>
      </div>
    </div>
  );
}
