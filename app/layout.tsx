import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Shell } from "@/components/layout/Shell"
import { SplashScreen } from "@/components/feedback/SplashScreen"
import { RouteChangeLoader } from "@/components/feedback/RouteChangeLoader"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Hudyat — New Era University Student Publication",
    template: "%s — Hudyat",
  },
  description: "The official student publication of New Era University. News, features, editorials, opinions, literary works, and sports coverage.",
  icons: {
    icon: "/hudyat-logo.png",
    shortcut: "/hudyat-logo.png",
    apple: "/hudyat-logo.png",
  },
  openGraph: {
    title: "Hudyat — NEU Student Publication",
    description: "The official student publication of New Era University.",
    type: "website",
    locale: "en_PH",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <SplashScreen>
              <Shell>{children}</Shell>
            </SplashScreen>
            <RouteChangeLoader />
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
