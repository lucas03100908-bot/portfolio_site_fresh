"use client";

import { useCallback } from "react";
import { categoryMap } from "@/lib/categories";
import { useTouchLayout } from "@/hooks/use-touch-layout";
import { useHomeWarmup } from "./useHomeWarmup";
import { useCategorySelection } from "./useCategorySelection";
import { useHomeBackgroundMedia } from "./useHomeBackgroundMedia";

interface UsePortfolioHomeStateOptions {
  enableSelectTransition?: boolean;
  revealPanelBodyImmediately?: boolean;
}

export default function usePortfolioHomeState(
  {
    enableSelectTransition = false,
    revealPanelBodyImmediately = false,
  }: UsePortfolioHomeStateOptions = {}
) {
  const { isTouchLayout, layoutResolved } = useTouchLayout();
  const { warmPanelChunk } = useHomeWarmup(layoutResolved);

  const {
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
  } = useCategorySelection({
    isTouchLayout,
    layoutResolved,
    enableSelectTransition,
    revealPanelBodyImmediately,
    warmPanelChunk,
  });

  const activeCategory = isTouchLayout
    ? selectedCategory ?? mobileTransitionCategory
    : selectedCategory ?? hoveredCategory ?? desktopTransitionCategory;

  const activeData = activeCategory ? categoryMap[activeCategory] : null;
  const selectedData = selectedCategory ? categoryMap[selectedCategory] : null;

  const isMobileTransitionActive =
    isTouchLayout && mobileTransitionCategory !== null && selectedData === null;

  const isDesktopTransitionActive =
    !isTouchLayout && desktopTransitionCategory !== null && selectedData === null;

  const panelOpen = selectedData !== null;

  const { backgroundVideo, prewarmBackgroundVideo } = useHomeBackgroundMedia({
    isTouchLayout,
    mobileTransitionCategory,
    desktopTransitionCategory,
    activeData,
    enableSelectTransition,
    hoveredCategory,
    isDesktopTransitionActive,
    panelOpen,
  });

  const handleBackgroundVideoComplete = useCallback(() => {
    const transitionCategory = isTouchLayout
      ? mobileTransitionCategory
      : desktopTransitionCategory;

    if (!transitionCategory || selectedCategory) {
      return;
    }

    openCategoryPanel(transitionCategory, { preserveHover: false });
  }, [
    desktopTransitionCategory,
    isTouchLayout,
    mobileTransitionCategory,
    openCategoryPanel,
    selectedCategory,
  ]);

  return {
    activeCategory,
    activeData,
    prewarmBackgroundVideo,
    backgroundVideoSessionKey,
    backgroundVideo,
    handleBackgroundVideoComplete,
    isDesktopTransitionActive,
    isMobileTransitionActive,
    isTouchLayout,
    layoutResolved,
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
