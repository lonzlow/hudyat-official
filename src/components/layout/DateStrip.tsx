"use client";

import { useEffect, useState } from "react";

const formatDateTime = (d: Date) => {
  const date = d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const time = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return { date, time };
};

export const DateStrip = () => {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // Sync clock with the real time — legitimate setState in effect
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  if (!now) {
    return (
      <div className="bg-date-strip text-date-strip-foreground border-y border-accent/30">
        <div className="container py-2 text-right text-sm">
          <span className="font-medium">&nbsp;</span>
        </div>
      </div>
    );
  }

  const { date, time } = formatDateTime(now);

  return (
    <div className="bg-date-strip text-date-strip-foreground border-y border-accent/30">
      <div className="container py-2 text-right text-sm">
        <span className="font-medium">{date}</span>{" "}
        <span>{time}</span>{" "}
        <abbr title="Philippine Standard Time" className="font-semibold no-underline">PhST</abbr>
      </div>
    </div>
  );
};
