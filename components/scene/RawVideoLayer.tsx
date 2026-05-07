"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface RawVideoLayerProps {
  src: string | null;
  isActive: boolean;
  isTransition?: boolean;
  onComplete?: () => void;
  onReady?: () => void;
  playOnce?: boolean;
  preload?: "auto" | "metadata" | "none";
}

export function RawVideoLayer({
  src,
  isActive,
  isTransition = false,
  onComplete,
  onReady,
  playOnce = false,
  preload = "metadata",
}: RawVideoLayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [lastSrc, setLastSrc] = useState<string | null>(src);

  if (src !== lastSrc) {
    setIsVisible(false);
    setLastSrc(src);
  }

  const handleVideoPlay = useCallback(async (video: HTMLVideoElement) => {
    if (!video.paused) return;
    try {
      await video.play();
    } catch (err) {
      console.warn("Video play interrupted or blocked:", err);
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    const handleCanPlay = () => {
      if (isActive) {
        setIsVisible(true);
        onReady?.();
        void handleVideoPlay(video);
      }
    };

    const handleEnded = () => {
      if (isActive && playOnce) {
        onComplete?.();
      }
    };

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("loadeddata", handleCanPlay);
    video.addEventListener("ended", handleEnded);

    // Only set src and load if it's different from current
    if (video.getAttribute("data-src") !== src) {
      video.setAttribute("data-src", src);
      video.src = src;
      // Use standard load only when necessary
      if (isActive || preload === "auto") {
        video.load();
      }
    } else if (isActive) {
      if (video.readyState >= 3) {
        handleCanPlay();
      } else {
        void handleVideoPlay(video);
      }
    } else {
      video.pause();
    }

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("loadeddata", handleCanPlay);
      video.removeEventListener("ended", handleEnded);
    };
  }, [src, isActive, onComplete, onReady, playOnce, handleVideoPlay, preload]);

  if (!src) return null;

  return (
    <video
      ref={videoRef}
      muted
      playsInline
      loop={!playOnce}
      preload={preload}
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-in-out ${
        isActive && isVisible ? "opacity-100" : "opacity-0"
      } ${isTransition ? "z-10" : "z-0"}`}
    />
  );
}
