"use client";

import { memo } from "react";
import { RawVideoLayer } from "./RawVideoLayer";

interface BackgroundVideoLayerProps {
  idleSrc?: string | null;
  videoSrc: string | null;
  prewarmSrc?: string | null;
  isHovering: boolean;
  isTransitioning: boolean;
  playOnce: boolean;
  onReady: () => void;
  onComplete?: () => void;
}

const BackgroundVideoLayer = ({
  idleSrc,
  videoSrc,
  prewarmSrc,
  isHovering,
  isTransitioning,
  playOnce,
  onReady,
  onComplete,
}: BackgroundVideoLayerProps) => {
  // Remove videos from DOM on hover to save GPU — but NOT during transition (spider video must render)
  if (isHovering && !isTransitioning) return null;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {idleSrc && (
        <video
          data-testid="idle-background-video"
          src={idleSrc}
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
        />
      )}
      
      <div className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${isTransitioning ? "opacity-100" : "opacity-0"}`}>
        <RawVideoLayer
          src={videoSrc}
          isActive={isTransitioning}
          isTransition={true}
          playOnce={playOnce}
          onReady={onReady}
          onComplete={onComplete}
          preload="auto"
        />
        {prewarmSrc && (
          <RawVideoLayer
            src={prewarmSrc}
            isActive={false}
            preload="auto"
          />
        )}
      </div>
    </div>
  );
};

export default memo(BackgroundVideoLayer);
