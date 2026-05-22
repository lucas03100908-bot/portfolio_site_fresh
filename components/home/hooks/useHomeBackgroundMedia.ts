"use client";

import { useMemo } from "react";
import { categoryMap } from "@/lib/categories";
import {
  getCategoryBackgroundVideo,
} from "@/lib/category-media";
import { CategoryKey, CategoryInfo } from "@/lib/types";

interface BackgroundMediaOptions {
  isTouchLayout: boolean;
  mobileTransitionCategory: CategoryKey | null;
  desktopTransitionCategory: CategoryKey | null;
  activeData: CategoryInfo | null;
  enableSelectTransition: boolean;
  hoveredCategory: CategoryKey | null;
  isDesktopTransitionActive: boolean;
  panelOpen: boolean;
}

export function useHomeBackgroundMedia({
  isTouchLayout,
  mobileTransitionCategory,
  desktopTransitionCategory,
  activeData,
  enableSelectTransition,
  hoveredCategory,
  isDesktopTransitionActive,
  panelOpen,
}: BackgroundMediaOptions) {
  const backgroundMediaData = useMemo(() => {
    if (isTouchLayout) {
      return mobileTransitionCategory ? categoryMap[mobileTransitionCategory] : null;
    }
    if (isDesktopTransitionActive) {
      return desktopTransitionCategory ? categoryMap[desktopTransitionCategory] : null;
    }
    return enableSelectTransition ? null : activeData;
  }, [isTouchLayout, mobileTransitionCategory, isDesktopTransitionActive, desktopTransitionCategory, enableSelectTransition, activeData]);

  const prewarmBackgroundMediaData = useMemo(() =>
    !isTouchLayout && !isDesktopTransitionActive && !panelOpen && hoveredCategory
      ? categoryMap[hoveredCategory]
      : null
  , [isTouchLayout, isDesktopTransitionActive, panelOpen, hoveredCategory]);

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

  return {
    backgroundVideo,
    prewarmBackgroundVideo,
  };
}
