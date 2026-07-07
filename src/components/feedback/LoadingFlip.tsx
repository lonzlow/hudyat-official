import Image from "next/image";
import { cn } from "@/lib/utils";

export const LoadingFlip = ({
  text,
  className,
  size = 80,
}: {
  text?: string;
  className?: string;
  size?: number;
}) => (
  <>
    <style>{`@keyframes hudyat-flip{0%{transform:rotateY(0deg)}100%{transform:rotateY(360deg)}}`}</style>
    <div
      aria-busy="true"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        className,
      )}
    >
      <div
        style={{
          animation: "hudyat-flip 1.5s ease-in-out infinite",
          perspective: "800px",
        }}
      >
        <Image
          src="/Hudyat-logo.svg"
          alt="Loading"
          width={size}
          height={size}
          style={{ width: size, height: size }}
          className="w-auto"
        />
      </div>
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse font-serif italic">
          {text}
        </p>
      )}
    </div>
  </>
);
