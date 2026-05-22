"use client";

import { memo, useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";

import AnimatedGradientBackground from "@/components/scene/AnimatedGradientBackground";
import BackgroundVideoLayer from "@/components/scene/BackgroundVideoLayer";
import AtmosphereLayer from "@/components/scene/AtmosphereLayer";
import { CategoryKey } from "@/lib/types";

const SpotlightLayer = dynamic(() => import("@/components/scene/SpotlightLayer"), {
  ssr: false,
});

interface HomeBackgroundStageProps {
  activeCategory?: CategoryKey | null;
  backgroundIdleVideo?: string | null;
  backgroundVideo: string | null;
  prewarmBackgroundVideo?: string | null;
  backgroundVideoSessionKey?: number;
  isTouchLayout?: boolean;
  onBackgroundVideoComplete?: () => void;
  panelOpen: boolean;
  playBackgroundVideoOnce?: boolean;
}

function HomeBackgroundStage({
  activeCategory = null,
  backgroundIdleVideo,
  backgroundVideo,
  prewarmBackgroundVideo,
  backgroundVideoSessionKey = 0,
  isTouchLayout = false,
  onBackgroundVideoComplete,
  panelOpen,
  playBackgroundVideoOnce = false,
}: HomeBackgroundStageProps) {
  const isTransitioning = Boolean(backgroundVideo);
  const isHoveringCategory = Boolean(activeCategory) && !panelOpen;
  
  const [readyVideoSessionKey, setReadyVideoSessionKey] = useState<number | null>(null);
  
  const transitionMaskVisible = Boolean(
    isTransitioning &&
      playBackgroundVideoOnce &&
      readyVideoSessionKey !== backgroundVideoSessionKey
  );

  const handleVideoReady = useCallback(() => {
    setReadyVideoSessionKey(backgroundVideoSessionKey);
  }, [backgroundVideoSessionKey]);

  useEffect(() => {
    if (!transitionMaskVisible) return;
    const timer = window.setTimeout(() => {
      setReadyVideoSessionKey(backgroundVideoSessionKey);
    }, 900);
    return () => window.clearTimeout(timer);
  }, [transitionMaskVisible, backgroundVideoSessionKey]);

  if (panelOpen) {
    return (
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden bg-[#02060b]"
        suppressHydrationWarning
      >
        <div className="absolute inset-0 bg-[#02060b]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(255,255,255,0.035)_0%,transparent_30%),linear-gradient(180deg,rgba(3,6,10,0.12)_0%,rgba(3,6,10,0.38)_52%,rgba(2,5,9,0.9)_100%)]" />
        <div
          data-testid="transition-mask"
          className="pointer-events-none absolute inset-0 bg-[#02060b] opacity-0"
        />
      </div>
    );
  }

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden bg-[#02060b] transform-gpu"
      suppressHydrationWarning
    >
      {/* 1. Visual Base: Gradient Mist */}
      <AnimatedGradientBackground 
        category={activeCategory} 
        paused={panelOpen || isTransitioning} 
      />

      {/* 2. Media: Videos (Auto-killed on hover) */}
      <BackgroundVideoLayer
        idleSrc={backgroundIdleVideo}
        videoSrc={backgroundVideo}
        prewarmSrc={prewarmBackgroundVideo}
        isHovering={isHoveringCategory}
        isTransitioning={isTransitioning}
        playOnce={playBackgroundVideoOnce}
        onReady={handleVideoReady}
        onComplete={onBackgroundVideoComplete}
      />

      {/* 3. Post-Processing: Atmosphere & Overlays */}
      <AtmosphereLayer 
        isHovering={isHoveringCategory}
        isTransitioning={isTransitioning}
        panelOpen={panelOpen}
      />

      {/* 4. Interactive: Spotlight (logic isolated) */}
      {!isTouchLayout && (
        <SpotlightLayer 
          isActive={!isHoveringCategory && !panelOpen} 
          panelOpen={panelOpen} 
        />
      )}

      {/* 5. Utility: Transition Mask */}
      <div
        data-testid="transition-mask"
        className={`pointer-events-none absolute inset-0 bg-[#02060b] transition-opacity duration-200 transform-gpu ${
          transitionMaskVisible ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

export default memo(HomeBackgroundStage);
