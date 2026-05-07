"use client";

import { useEffect, useState } from "react";

const MOBILE_INTERACTION_QUERY =
  "(max-width: 1199px), ((hover: none) and (pointer: coarse))";

/**
 * Hook to detect if the current layout should be optimized for touch interaction
 * based on screen width and device capabilities.
 */
export function useTouchLayout() {
  const [isTouchLayout, setIsTouchLayout] = useState(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return false;
    }
    return window.matchMedia(MOBILE_INTERACTION_QUERY).matches;
  });
  const [layoutResolved, setLayoutResolved] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQuery = window.matchMedia(MOBILE_INTERACTION_QUERY);

    const updateTouchLayout = () => {
      setIsTouchLayout(mediaQuery.matches);
      setLayoutResolved(true);
    };

    // Initial sync
    updateTouchLayout();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateTouchLayout);

      return () => {
        mediaQuery.removeEventListener("change", updateTouchLayout);
      };
    }

    // Fallback for older browsers
    mediaQuery.addListener(updateTouchLayout);

    return () => {
      mediaQuery.removeListener(updateTouchLayout);
    };
  }, []);

  return { isTouchLayout, layoutResolved };
}
