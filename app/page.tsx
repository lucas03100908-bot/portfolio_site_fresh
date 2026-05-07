"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";

import CategoryPanel from "@/components/home/CategoryPanel";
import HomeAboutSection from "@/components/home/HomeAboutSection";
import CategorySidebar from "@/components/home/CategorySidebar";
import HomeBackgroundStage from "@/components/home/HomeBackgroundStage";
import usePortfolioHomeState from "@/components/home/usePortfolioHomeState";
import { useScrollPast } from "@/hooks/use-scroll-past";

export default function Home() {
  const idleBackgroundVideo = "/spider/idle_spider.mp4";
  const [isMediaZoneActive, setIsMediaZoneActive] = useState(false);
  const isPastHero = useScrollPast(0.75);
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
  selectedData,
  handleCategoryHover,
  handleCategoryHoverClear,
  handleCategoryPressStart,
  handleCategorySelect,
  handlePanelClose,
} = usePortfolioHomeState({
  enableDesktopSelectTransition: !isPastHero,
});

  const mobileHeroHidden = isTouchLayout && (isMobileTransitionActive || panelOpen);
  const shouldSuppressBackgroundMedia = isMediaZoneActive;

  return (
    <main className="relative min-h-[100svh] w-full overflow-x-hidden bg-[#02060b] text-white">
      <HomeBackgroundStage
        activeCategory={activeCategory}
        backgroundIdleVideo={idleBackgroundVideo}
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

      {isTouchLayout ? (
        <div className="relative z-20">
          <section
            className={`relative min-h-[100svh] transition-opacity duration-300 ${
              mobileHeroHidden ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
            aria-hidden={mobileHeroHidden}
            aria-label="Portfolio Hero"
          >
            <CategorySidebar
              activeCategory={activeCategory}
              isTouchLayout={isTouchLayout}
              layoutMode="overlay"
              onCategoryHover={handleCategoryHover}
              onCategoryHoverClear={handleCategoryHoverClear}
              onCategoryPressStart={handleCategoryPressStart}
              onCategorySelect={handleCategorySelect}
            />
          </section>

          <HomeAboutSection
            isTouchLayout={isTouchLayout}
            onMediaZoneActiveChange={setIsMediaZoneActive}
            suspendMedia={panelOpen}
          />
        </div>
      ) : (
        <div className="relative z-20">
          <div className={`hidden md:block transition-opacity duration-500 ${isMediaZoneActive ? "pointer-events-none opacity-0" : "opacity-100"}`}>
            <CategorySidebar
              activeCategory={activeCategory}
              isTouchLayout={isTouchLayout}
              layoutMode="fixed"
              onCategoryHover={handleCategoryHover}
              onCategoryHoverClear={handleCategoryHoverClear}
              onCategoryPressStart={handleCategoryPressStart}
              onCategorySelect={handleCategorySelect}
            />
          </div>

          <div>
            <section className="flex min-h-[100svh] items-end justify-end px-4 pb-8 sm:px-6 md:px-10 md:pb-10 xl:px-12">
              <div className="rounded-full border border-white/10 bg-black/24 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-white/44">
                Scroll for Showreel / About Me
              </div>
            </section>

            <HomeAboutSection
              isTouchLayout={isTouchLayout}
              onMediaZoneActiveChange={setIsMediaZoneActive}
              suspendMedia={panelOpen}
            />
          </div>
        </div>
      )}

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
