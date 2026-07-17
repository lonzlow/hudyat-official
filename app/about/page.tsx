"use client"

import { useState } from "react"

function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <div
      className={`animate-fade-in-up ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export default function AboutPage() {
  const [titleHovered, setTitleHovered] = useState(false)
  const [missionHovered, setMissionHovered] = useState(false)
  const [visionHovered, setVisionHovered] = useState(false)

  return (
    <>
      {/* ── Hero Banner ── */}
      <div className="w-full h-72 sm:h-80 md:h-96 relative bg-primary overflow-hidden">
        <img
          src="/images/hudyat_staff.png"
          alt="Hudyat Staff"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/55 to-black/85" />

        <div
          className="absolute inset-0 z-20 flex flex-row items-center justify-center px-8 sm:px-12 lg:px-20 gap-8 lg:gap-14"
          style={{ animation: "heroFadeIn 0.8s ease both" }}
        >
          {/* Logo */}
          <div
            className="flex-shrink-0 hidden sm:block"
            style={{ animation: "heroFadeIn 0.8s ease 0.1s both" }}
          >
            <img
              src="/Hudyat-logo.svg"
              alt="Hudyat Logo"
              className="h-20 sm:h-24 md:h-28 lg:h-36 w-auto"
            />
          </div>

          <div className="hidden sm:block w-px h-20 bg-white/25 flex-shrink-0" />

          {/* Text */}
          <div
            className="flex-1 max-w-lg"
            style={{ animation: "heroFadeIn 0.8s ease 0.25s both" }}
          >
            <div
              className="cursor-default mb-3"
              onMouseEnter={() => setTitleHovered(true)}
              onMouseLeave={() => setTitleHovered(false)}
            >
              <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold italic mb-1.5">
                About Hudyat
              </h2>
              <div
                style={{
                  height: "2px",
                  background: "hsl(var(--hudyat-gold))",
                  width: titleHovered ? "100%" : "2rem",
                  transition: "width 0.4s ease",
                }}
              />
            </div>
            <p className="text-white/85 text-xs sm:text-sm lg:text-base leading-relaxed text-justify">
              Hudyat is the official student publication of New Era University.
              It is managed by student journalists and editors and is committed
              to delivering timely, relevant, and impactful stories to the
              academic community.
            </p>
          </div>
        </div>
      </div>

      {/* ── Unified Content Section ── */}
      <div className="w-full bg-background">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-10 sm:py-12 lg:py-14">

          {/* What We Do label + Description */}
          <FadeUp delay={300} className="mb-8 sm:mb-10">
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-primary mb-3">
              What We Do
            </p>
            <div className="w-full space-y-3 text-sm sm:text-base leading-relaxed text-muted-foreground text-justify">
              <p>
                It covers a wide range of content—from campus news and features
                to editorials, literary works, sports, and multimedia
                productions—reflecting the voices and experiences of NEU
                students.
              </p>
              <p>
                Hudyat upholds responsible journalism while fostering critical
                thinking and awareness among its readers. As the voice of the
                student body, it aims to inform, inspire, and empower the
                community while continuously striving for excellence in campus
                journalism.
              </p>
            </div>
          </FadeUp>

          {/* Divider */}
          <FadeUp delay={450}>
            <div className="w-full h-px bg-border mb-8 sm:mb-10" />
          </FadeUp>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1px_1fr] lg:items-stretch gap-8 lg:gap-0">

            {/* Mission */}
            <FadeUp delay={550} className="lg:pr-16">
              <div
                onMouseEnter={() => setMissionHovered(true)}
                onMouseLeave={() => setMissionHovered(false)}
                className="cursor-default mb-4"
              >
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-1.5">
                  Mission
                </h3>
                <div
                  style={{
                    height: "2px",
                    background: "hsl(var(--primary))",
                    width: missionHovered ? "100%" : "2rem",
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
              <div className="space-y-3 text-sm sm:text-base leading-relaxed text-muted-foreground text-justify">
                <p>
                  To provide comprehensive and accurate reporting of university
                  news, events, and achievements while fostering a culture of
                  transparency and engagement within our academic community.
                </p>
                <p>
                  We strive to amplify student voices, celebrate academic
                  excellence, and bridge the gap between administration and the
                  student body through quality journalism.
                </p>
              </div>
            </FadeUp>

            {/* Vertical divider */}
            <div className="hidden lg:block bg-border" />

            {/* Vision */}
            <FadeUp delay={700} className="lg:pl-16">
              <div
                onMouseEnter={() => setVisionHovered(true)}
                onMouseLeave={() => setVisionHovered(false)}
                className="cursor-default mb-4"
              >
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-1.5">
                  Vision
                </h3>
                <div
                  style={{
                    height: "2px",
                    background: "hsl(var(--secondary))",
                    width: visionHovered ? "100%" : "2rem",
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
              <div className="space-y-3 text-sm sm:text-base leading-relaxed text-muted-foreground text-justify">
                <p>
                  To be the leading voice of our university community, recognized
                  for our commitment to truth, integrity, and excellence in
                  collegiate journalism.
                </p>
                <p>
                  We envision a future where our publication serves as a catalyst
                  for positive change, inspiring dialogue and fostering unity
                  among students, faculty, and staff.
                </p>
              </div>
            </FadeUp>

          </div>
        </div>
      </div>

    </>
  )
}
