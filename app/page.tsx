"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";

import CategoryPanel from "@/components/home/CategoryPanel";
import HomeAboutSection from "@/components/home/HomeAboutSection";
import CategorySidebar from "@/components/home/CategorySidebar";
import HomeBackgroundStage from "@/components/home/HomeBackgroundStage";
import usePortfolioHomeState from "@/components/home/hooks/usePortfolioHomeState";
import { useScrollPast } from "@/hooks/use-scroll-past";

export default function Home() {
  const idleBackgroundVideo = "/spider/idle_spider.mp4";
  const [isMediaZoneActive, setIsMediaZoneActive] = useState(false);
  const isPastHeroSection = useScrollPast();
  const shouldOpenImmediately = isPastHeroSection;

  const {
    activeCategory,
    backgroundVideo,
    prewarmBackgroundVideo,
    backgroundVideoSessionKey,
    handleBackgroundVideoComplete,
    isDesktopTransitionActive,
    isMobileTransitionActive,
    panelBodyReady,
    panelOpen,
    isTouchLayout,
    layoutResolved,
    selectedData,
    handleCategoryHover,
    handleCategoryHoverClear,
    handleCategoryPressStart,
    handleCategorySelect,
    handlePanelClose,
  } = usePortfolioHomeState({
    enableSelectTransition: !shouldOpenImmediately,
    revealPanelBodyImmediately: shouldOpenImmediately,
  });

  const handleReturnHome = useCallback(() => {
    handlePanelClose();
    setIsMediaZoneActive(false);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [handlePanelClose]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }
      handleReturnHome();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleReturnHome]);

  const mobileHeroHidden = isTouchLayout && (isMobileTransitionActive || panelOpen);
  const shouldSuppressBackgroundMedia = isMediaZoneActive;
  const showResponsiveUi = layoutResolved;

  return (
    <main className="relative min-h-[100svh] w-full overflow-x-hidden bg-[#02060b] text-white">
      <HomeBackgroundStage
        activeCategory={activeCategory}
        backgroundIdleVideo={shouldSuppressBackgroundMedia || panelOpen ? null : idleBackgroundVideo}
        isTouchLayout={isTouchLayout}
        backgroundVideo={shouldSuppressBackgroundMedia ? null : backgroundVideo}
        prewarmBackgroundVideo={shouldSuppressBackgroundMedia ? null : prewarmBackgroundVideo}
        backgroundVideoSessionKey={backgroundVideoSessionKey}
        onBackgroundVideoComplete={handleBackgroundVideoComplete}
        panelOpen={panelOpen}
        playBackgroundVideoOnce={
          !shouldSuppressBackgroundMedia &&
          (isMobileTransitionActive || isDesktopTransitionActive)
        }
      />

      <div
        className={`relative z-20 transition-opacity duration-200 ${
          showResponsiveUi ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!showResponsiveUi}
      >
        {isTouchLayout ? (
          <section
            className={`relative min-h-[100svh] transition-opacity duration-300 ${
              mobileHeroHidden || isMediaZoneActive ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
            aria-hidden={mobileHeroHidden || isMediaZoneActive}
            aria-label="Portfolio Hero"
          >
            <CategorySidebar
              activeCategory={activeCategory}
              isTouchLayout={isTouchLayout}
              layoutMode="overlay"
              theme={isMediaZoneActive ? "light" : "dark"}
              onReset={handleReturnHome}
              onCategoryHover={handleCategoryHover}
              onCategoryHoverClear={handleCategoryHoverClear}
              onCategoryPressStart={handleCategoryPressStart}
              onCategorySelect={handleCategorySelect}
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+1.25rem)] flex justify-center">
              <div className="rounded-full border border-white/10 bg-black/24 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-white/44">
                Scroll for Showreel / About Me
              </div>
            </div>
          </section>
        ) : (
          <>
            <div className="hidden md:block">
              <div
                className={`pointer-events-none fixed inset-y-0 left-0 z-[25] hidden bg-[#F3F4F6] shadow-[22px_0_42px_-30px_rgba(15,23,42,0.28),10px_0_18px_-14px_rgba(15,23,42,0.14)] transition-opacity duration-500 md:block ${
                  isMediaZoneActive ? "opacity-100" : "opacity-0"
                }`}
                style={{ width: "calc(min(36vw, 560px) - 50px)" }}
              />

              <CategorySidebar
                activeCategory={activeCategory}
                isTouchLayout={isTouchLayout}
                layoutMode="fixed"
                theme={isMediaZoneActive ? "light" : "dark"}
                onReset={handleReturnHome}
                onCategoryHover={handleCategoryHover}
                onCategoryHoverClear={handleCategoryHoverClear}
                onCategoryPressStart={handleCategoryPressStart}
                onCategorySelect={handleCategorySelect}
              />
            </div>

            <section className="flex min-h-[100svh] items-end justify-end px-4 pb-8 sm:px-6 md:px-10 md:pb-10 xl:px-12">
              <div className="rounded-full border border-white/10 bg-black/24 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-white/44">
                Scroll for Showreel / About Me
              </div>
            </section>
          </>
        )}

        <HomeAboutSection
          isTouchLayout={isTouchLayout}
          onProfileVisibleChange={setIsMediaZoneActive}
          suspendMedia={panelOpen}
        />
      </div>

      <AnimatePresence>
        {selectedData && !isTouchLayout ? (
          <motion.button
            key="category-panel-backdrop"
            type="button"
            aria-label="Close category panel"
            className="fixed inset-0 z-30 bg-[#02060b]/24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.2 } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            onClick={handlePanelClose}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {selectedData ? (
          <CategoryPanel
            key={selectedData.key}
            category={selectedData}
            isTouchLayout={isTouchLayout}
            panelBodyReady={panelBodyReady}
            onClose={handlePanelClose}
          />
        ) : null}
      </AnimatePresence>
    </main>
  );
}
