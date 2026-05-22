"use client";

import { useEffect, useState } from "react";

function isPastScrollThreshold(thresholdVh: number) {
  if (typeof window === "undefined") {
    return false;
  }

  return window.scrollY >= window.innerHeight * thresholdVh;
}

/**
 * Hook to detect if the user has scrolled past a certain vertical threshold.
 * @param thresholdVh The threshold in viewport height units (0 to 1). Default is 0.75 (75vh).
 */
export function useScrollPast(thresholdVh: number = 0.75) {
  const [isPastThreshold, setIsPastThreshold] = useState(() => isPastScrollThreshold(thresholdVh));

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkScroll = () => {
      setIsPastThreshold((current) => {
        const next = isPastScrollThreshold(thresholdVh);
        return next === current ? current : next;
      });
    };

    checkScroll();
    window.addEventListener("scroll", checkScroll, { passive: true });
    return () => window.removeEventListener("scroll", checkScroll);
  }, [thresholdVh]);

  return isPastThreshold;
}
