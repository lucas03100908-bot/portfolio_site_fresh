"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { categories } from "@/lib/categories";
import { CategoryKey } from "@/lib/types";
import { useAssetPreloader } from "@/hooks/use-asset-preloader";

const MOBILE_TRANSITION_FALLBACK_MS = 3_200;
const HOVER_DEBOUNCE_MS = 60;

interface UseCategorySelectionOptions {
  isTouchLayout: boolean;
  layoutResolved: boolean;
  enableSelectTransition: boolean;
  revealPanelBodyImmediately: boolean;
  warmPanelChunk: () => void;
}

interface OpenCategoryPanelOptions {
  preserveHover?: boolean;
  revealBodyImmediately?: boolean;
}

export function useCategorySelection({
  isTouchLayout,
  layoutResolved,
  enableSelectTransition,
  revealPanelBodyImmediately,
  warmPanelChunk,
}: UseCategorySelectionOptions) {
  const { warmCategoryBackgroundAssets } = useAssetPreloader();

  const [hoveredCategory, setHoveredCategory] = useState<CategoryKey | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(null);
  const [mobileTransitionCategory, setMobileTransitionCategory] = useState<CategoryKey | null>(null);
  const [desktopTransitionCategory, setDesktopTransitionCategory] = useState<CategoryKey | null>(null);
  const [backgroundVideoSessionKey, setBackgroundVideoSessionKey] = useState(0);
  const [panelBodyReady, setPanelBodyReady] = useState(false);

  const mobileOpenTimerRef = useRef<number | null>(null);
  const hoverTimerRef = useRef<number | null>(null);
  const hoverIdleCallbackRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (mobileOpenTimerRef.current !== null) {
      window.clearTimeout(mobileOpenTimerRef.current);
      mobileOpenTimerRef.current = null;
    }
    if (hoverTimerRef.current !== null) {
      window.clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    if (hoverIdleCallbackRef.current !== null && typeof window !== "undefined") {
      window.cancelIdleCallback?.(hoverIdleCallbackRef.current);
      hoverIdleCallbackRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  useEffect(() => {
    if (!selectedCategory || panelBodyReady || typeof window === "undefined") {
      return;
    }

    const revealPanelBody = () => {
      setPanelBodyReady(true);
    };

    // Two rAF frames (~32ms) — enough for the panel's first composite frame to
    // be on screen before React renders the full content tree, avoiding jank
    // while being far faster than the previous requestIdleCallback (up to 450ms).
    let raf1 = 0;
    let raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(revealPanelBody);
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [panelBodyReady, selectedCategory]);

  const openCategoryPanel = useCallback(
    (
      category: CategoryKey,
      {
        preserveHover = !isTouchLayout,
        revealBodyImmediately = false,
      }: OpenCategoryPanelOptions = {}
    ) => {
      clearTimers();
      warmPanelChunk();
      setPanelBodyReady(revealBodyImmediately);
      setMobileTransitionCategory(null);
      setDesktopTransitionCategory(null);
      setSelectedCategory(category);
      setHoveredCategory(preserveHover ? category : null);
    },
    [clearTimers, isTouchLayout, warmPanelChunk]
  );

  const handleCategoryHover = useCallback(
    (category: CategoryKey) => {
      if (isTouchLayout || desktopTransitionCategory) {
        return;
      }
      setHoveredCategory(category);
      if (hoverTimerRef.current !== null) {
        window.clearTimeout(hoverTimerRef.current);
      }
      if (hoverIdleCallbackRef.current !== null) {
        window.cancelIdleCallback?.(hoverIdleCallbackRef.current);
        hoverIdleCallbackRef.current = null;
      }
      hoverTimerRef.current = window.setTimeout(() => {
        const idleWindow = window;
        if (typeof idleWindow.requestIdleCallback === "function") {
          hoverIdleCallbackRef.current = idleWindow.requestIdleCallback(() => {
            warmCategoryBackgroundAssets(category, {
              hoverVideoMode: null,
              preloadPreviewImage: true,
              transitionVideoMode: "metadata",
            });
            hoverIdleCallbackRef.current = null;
          }, { timeout: 200 });
        } else {
          warmCategoryBackgroundAssets(category, {
            hoverVideoMode: null,
            preloadPreviewImage: true,
            transitionVideoMode: "metadata",
          });
        }
        hoverTimerRef.current = null;
      }, HOVER_DEBOUNCE_MS);
    },
    [desktopTransitionCategory, isTouchLayout, warmCategoryBackgroundAssets]
  );

  const handleCategoryPressStart = useCallback(
    (category: CategoryKey) => {
      if (hoverTimerRef.current !== null) {
        window.clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = null;
      }
      warmCategoryBackgroundAssets(category, {
        hoverVideoMode: null,
        transitionVideoMode: "auto",
      });
      setHoveredCategory(category);
    },
    [warmCategoryBackgroundAssets]
  );

  const handleCategoryHoverClear = useCallback(() => {
    if (desktopTransitionCategory) {
      return;
    }
    if (hoverTimerRef.current !== null) {
      window.clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setHoveredCategory(null);
  }, [desktopTransitionCategory]);

  const handleCategorySelect = useCallback(
    (category: CategoryKey) => {
      clearTimers();
      if (enableSelectTransition) {
        warmCategoryBackgroundAssets(category, {
          hoverVideoMode: null,
          transitionVideoMode: "auto",
        });
        setBackgroundVideoSessionKey((current) => current + 1);
        setPanelBodyReady(false);
        setSelectedCategory(null);
        setHoveredCategory(null);
        if (isTouchLayout) {
          setMobileTransitionCategory(category);
        } else {
          setDesktopTransitionCategory(category);
        }
        mobileOpenTimerRef.current = window.setTimeout(() => {
          openCategoryPanel(category, { preserveHover: false });
        }, MOBILE_TRANSITION_FALLBACK_MS);
        return;
      }
      openCategoryPanel(category, {
        revealBodyImmediately: revealPanelBodyImmediately,
      });
    },
    [
      clearTimers,
      enableSelectTransition,
      isTouchLayout,
      openCategoryPanel,
      revealPanelBodyImmediately,
      warmCategoryBackgroundAssets,
    ]
  );

  const handlePanelClose = useCallback(() => {
    clearTimers();
    setPanelBodyReady(false);
    setSelectedCategory(null);
    setHoveredCategory(null);
    setMobileTransitionCategory(null);
    setDesktopTransitionCategory(null);
  }, [clearTimers]);

  useEffect(() => {
    if (isTouchLayout && layoutResolved) {
      categories.forEach((category) => {
        warmCategoryBackgroundAssets(category.key, {
          hoverVideoMode: null,
          transitionVideoMode: "metadata",
        });
      });
    }
  }, [isTouchLayout, layoutResolved, warmCategoryBackgroundAssets]);

  return {
    hoveredCategory,
    selectedCategory,
    mobileTransitionCategory,
    desktopTransitionCategory,
    backgroundVideoSessionKey,
    panelBodyReady,
    handleCategoryHover,
    handleCategoryHoverClear,
    handleCategoryPressStart,
    handleCategorySelect,
    handlePanelClose,
    openCategoryPanel,
  };
}
