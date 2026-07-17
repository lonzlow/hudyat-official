import Image from "next/image";
import { cn } from "@/lib/utils";

export const LoadingFlip = ({
  className,
  size = 80,
}: {
  className?: string;
  size?: number;
}) => (
  <>
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
          animation: "hudyat-flip 1.5s linear infinite",
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
      <div className="mt-4 h-1 w-72 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary"
          style={{ animation: "loading-progress 3s ease-in-out forwards" }}
        />
      </div>
    </div>
  </>
);
