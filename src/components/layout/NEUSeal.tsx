"use client";

interface NEUSealProps {
  className?: string;
  size?: number;
}

export const NEUSeal = ({ className, size = 56 }: NEUSealProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="New Era University seal"
      role="img"
    >
      <circle cx="32" cy="32" r="30" fill="hsl(var(--banner-foreground))" />
      <circle cx="32" cy="32" r="28" fill="none" stroke="hsl(var(--banner))" strokeWidth="2" />
      <circle cx="32" cy="32" r="20" fill="hsl(var(--banner))" />
      <path
        d="M16 34 Q24 30 32 34 Q40 30 48 34 L48 42 Q40 38 32 42 Q24 38 16 42 Z"
        fill="hsl(var(--banner-foreground))"
      />
      <path d="M32 34 L32 42" stroke="hsl(var(--banner))" strokeWidth="1" />
      <g fill="hsl(var(--hudyat-gold))">
        <circle cx="32" cy="22" r="3" />
        <path d="M32 14 L33 18 L31 18 Z" />
        <path d="M26 16 L28 19 L26 20 Z" />
        <path d="M38 16 L36 19 L38 20 Z" />
      </g>
      <text
        x="32"
        y="54"
        textAnchor="middle"
        fontSize="4"
        fill="hsl(var(--banner-foreground))"
        fontFamily="Inter, sans-serif"
        fontWeight="700"
      >
        NEU · 1975
      </text>
    </svg>
  );
};
