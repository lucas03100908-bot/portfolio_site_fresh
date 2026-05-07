"use client";

import { useCallback, useEffect, useRef, useState, useMemo } from "react";

import { categories, categoryMap } from "@/lib/categories";
import {
  getCategoryBackgroundVideo,
  getCategoryBackgroundImage,
} from "@/lib/category-media";
import { CategoryKey } from "@/lib/types";
import { useTouchLayout } from "@/hooks/use-touch-layout";
import { useAssetPreloader } from "@/hooks/use-asset-preloader";

const MOBILE_TRANSITION_FALLBACK_MS = 3_200;
const HOVER_DEBOUNCE_MS = 60; // Reduced for better responsiveness while still preventing jitter

interface UsePortfolioHomeStateOptions {
  enableDesktopSelectTransition?: boolean;
}

export default function usePortfolioHomeState(
  { enableDesktopSelectTransition = false }: UsePortfolioHomeStateOptions = {}
) {
  const { isTouchLayout, layoutResolved } = useTouchLayout();
  const { warmPanelChunk, warmCategoryBackgroundAssets } = useAssetPreloader();

  const [hoveredCategory, setHoveredCategory] =
    useState<CategoryKey | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryKey | null>(null);
  const [mobileTransitionCategory, setMobileTransitionCategory] =
    useState<CategoryKey | null>(null);
  const [desktopTransitionCategory, setDesktopTransitionCategory] =
    useState<CategoryKey | null>(null);
  const [backgroundVideoSessionKey, setBackgroundVideoSessionKey] =
    useState(0);
  const [panelBodyReady, setPanelBodyReady] = useState(false);

  const mobileOpenTimerRef = useRef<number | null>(null);
  const hoverTimerRef = useRef<number | null>(null);

  // Derived states - minimized useMemo usage where not strictly necessary for stability
  const activeCategory = isTouchLayout
    ? selectedCategory ?? mobileTransitionCategory
    : hoveredCategory ?? selectedCategory ?? desktopTransitionCategory;

  const activeData = activeCategory ? categoryMap[activeCategory] : null;
  const selectedData = selectedCategory ? categoryMap[selectedCategory] : null;

  const isMobileTransitionActive =
    isTouchLayout && mobileTransitionCategory !== null && selectedData === null;

  const isDesktopTransitionActive =
    !isTouchLayout && desktopTransitionCategory !== null && selectedData === null;

  const panelOpen = selectedData !== null;

  const backgroundMediaData = useMemo(() => {
    if (isTouchLayout) {
      return mobileTransitionCategory ? categoryMap[mobileTransitionCategory] : null;
    }
    if (isDesktopTransitionActive) {
      return desktopTransitionCategory ? categoryMap[desktopTransitionCategory] : null;
    }
    return enableDesktopSelectTransition ? null : activeData;
  }, [isTouchLayout, mobileTransitionCategory, isDesktopTransitionActive, desktopTransitionCategory, enableDesktopSelectTransition, activeData]);

  const prewarmBackgroundMediaData = useMemo(() => 
    !isTouchLayout && enableDesktopSelectTransition && !isDesktopTransitionActive && !panelOpen && hoveredCategory
      ? categoryMap[hoveredCategory]
      : null
  , [isTouchLayout, enableDesktopSelectTransition, isDesktopTransitionActive, panelOpen, hoveredCategory]);

  const backgroundVideo = useMemo(() => 
    (isTouchLayout || isDesktopTransitionActive)
      ? getCategoryBackgroundVideo(backgroundMediaData, {
          panelOpen,
          useTransitionVideo: true,
        })
      : null
  , [isTouchLayout, isDesktopTransitionActive, backgroundMediaData, panelOpen]);

  const prewarmBackgroundVideo = useMemo(() => 
    getCategoryBackgroundVideo(prewarmBackgroundMediaData, {
      panelOpen: false,
      suppressWhenPanelOpen: false,
      useTransitionVideo: true,
    })
  , [prewarmBackgroundMediaData]);

  const backgroundImage = useMemo(() => 
    isDesktopTransitionActive
      ? null
      : getCategoryBackgroundImage(backgroundMediaData, { panelOpen })
  , [isDesktopTransitionActive, backgroundMediaData, panelOpen]);

  const clearTimers = useCallback(() => {
    if (mobileOpenTimerRef.current !== null) {
      window.clearTimeout(mobileOpenTimerRef.current);
      mobileOpenTimerRef.current = null;
    }
    if (hoverTimerRef.current !== null) {
      window.clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  }, []);

  // Lifecycle effects
  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  useEffect(() => {
    if (!layoutResolved || typeof window === "undefined") {
      return;
    }

    const browserWindow = window;
    let frameId = 0;
    let idleId: number | null = null;

    const warmPanelContent = () => {
      warmPanelChunk();
    };

    if (typeof browserWindow.requestIdleCallback === "function") {
      idleId = browserWindow.requestIdleCallback(warmPanelContent, {
        timeout: 900,
      });
    } else {
      frameId = requestAnimationFrame(() => {
        frameId = requestAnimationFrame(warmPanelContent);
      });
    }

    return () => {
      if (idleId !== null) {
        browserWindow.cancelIdleCallback?.(idleId);
      }
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [layoutResolved, warmPanelChunk]);

  useEffect(() => {
    if (!selectedCategory || typeof window === "undefined") {
      return;
    }

    const revealPanelBody = () => {
      setPanelBodyReady(true);
    };

    const win = window;
    const idleId = typeof win.requestIdleCallback === "function"
      ? win.requestIdleCallback(revealPanelBody, { timeout: 450 })
      : win.setTimeout(revealPanelBody, 450);

    return () => {
      if (typeof idleId === "number") {
        if (typeof win.requestIdleCallback === "function") {
          win.cancelIdleCallback?.(idleId);
        } else {
          win.clearTimeout(idleId);
        }
      }
    };
  }, [selectedCategory]);

  const openCategoryPanel = useCallback(
    (category: CategoryKey, preserveHover = !isTouchLayout) => {
      clearTimers();
      warmPanelChunk();
      setPanelBodyReady(false);
      setMobileTransitionCategory(null);
      setDesktopTransitionCategory(null);
      setSelectedCategory(category);
      setHoveredCategory(preserveHover ? category : null);
    },
    [clearTimers, isTouchLayout, warmPanelChunk]
  );

  const handleBackgroundVideoComplete = useCallback(() => {
    const transitionCategory = isTouchLayout
      ? mobileTransitionCategory
      : desktopTransitionCategory;

    if (!transitionCategory || selectedCategory) {
      return;
    }

    openCategoryPanel(transitionCategory, false);
  }, [
    desktopTransitionCategory,
    isTouchLayout,
    mobileTransitionCategory,
    openCategoryPanel,
    selectedCategory,
  ]);

  const handleCategoryHover = useCallback(
    (category: CategoryKey) => {
      if (isTouchLayout || desktopTransitionCategory) {
        return;
      }

      if (hoverTimerRef.current !== null) {
        window.clearTimeout(hoverTimerRef.current);
      }

      // Slightly faster debounce for snappier feel
      hoverTimerRef.current = window.setTimeout(() => {
        const idleWindow = window;

        if (typeof idleWindow.requestIdleCallback === "function") {
          idleWindow.requestIdleCallback(() => {
            warmCategoryBackgroundAssets(category, {
              hoverVideoMode: "metadata",
              preloadPreviewImage: true,
              transitionVideoMode: "metadata",
            });
          }, { timeout: 200 });
        }
        
        // Use functional update to ensure we have the latest state if needed
        setHoveredCategory(category);
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

      if (isTouchLayout || enableDesktopSelectTransition) {
        warmCategoryBackgroundAssets(category, {
          hoverVideoMode: null,
          transitionVideoMode: "auto",
        });

        if (!isTouchLayout && enableDesktopSelectTransition) {
          setTimeout(() => warmPanelChunk(), 500);
        }

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
          openCategoryPanel(category, false);
        }, MOBILE_TRANSITION_FALLBACK_MS);

        return;
      }

      openCategoryPanel(category);
    },
    [
      clearTimers,
      enableDesktopSelectTransition,
      isTouchLayout,
      openCategoryPanel,
      warmCategoryBackgroundAssets,
      warmPanelChunk,
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
    activeCategory,
    activeData,
    backgroundImage,
    prewarmBackgroundVideo,
    backgroundVideoSessionKey,
    backgroundVideo,
    handleBackgroundVideoComplete,
    isDesktopTransitionActive,
    isMobileTransitionActive,
    isTouchLayout,
    panelBodyReady,
    panelOpen,
    selectedData,
    handleCategoryHover,
    handleCategoryHoverClear,
    handleCategoryPressStart,
    handleCategorySelect,
    handlePanelClose,
  };
}