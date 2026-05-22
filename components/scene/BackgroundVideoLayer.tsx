"use client";

import { memo, useEffect, useRef } from "react";
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
  const idleVideoRef = useRef<HTMLVideoElement>(null);
  const suppressIdle = isHovering && !isTransitioning;

  // Explicitly call play() to ensure autoplay works on iOS Safari
  useEffect(() => {
    const video = idleVideoRef.current;
    if (!video || suppressIdle) return;
    video.defaultMuted = true;
    video.muted = true;
    video.playsInline = true;
    if (video.readyState < 2) {
      video.load();
    }
    video.play().catch(() => {});
  }, [suppressIdle, idleSrc]);

  if (suppressIdle && !prewarmSrc && !isTransitioning) return null;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {idleSrc && !suppressIdle && (
        <video
          ref={idleVideoRef}
          data-testid="idle-background-video"
          src={idleSrc}
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          preload="metadata"
          className="h-full w-full object-cover"
        />
      )}

      <div
        data-testid="background-media-layer"
        className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${isTransitioning ? "opacity-100" : "opacity-0"}`}
      >
        <RawVideoLayer
          src={videoSrc}
          isActive={isTransitioning}
          isTransition={true}
          playOnce={playOnce}
          onReady={onReady}
          onComplete={onComplete}
          preload="metadata"
        />
        {prewarmSrc && !isTransitioning ? (
          <RawVideoLayer
            src={prewarmSrc}
            isActive={false}
            preload="metadata"
          />
        ) : null}
      </div>
    </div>
  );
};

export default memo(BackgroundVideoLayer);
