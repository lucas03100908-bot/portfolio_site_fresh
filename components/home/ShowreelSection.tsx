"use client";

import { memo, useRef, useEffect } from "react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

interface ShowreelSectionProps {
  isTouchLayout: boolean;
  suspendMedia?: boolean;
}

const ShowreelSection = ({ isTouchLayout, suspendMedia = false }: ShowreelSectionProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { nodeRef, isIntersecting: inView } = useIntersectionObserver({
    rootMargin: "200px 0px",
    threshold: 0.01,
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.defaultMuted = true;
    video.muted = true;
    video.playsInline = true;
    if (inView && !suspendMedia) {
      if (video.readyState < 2) {
        video.load();
      }
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn("Showreel video playback failed:", error);
        });
      }
    } else {
      video.pause();
    }
  }, [inView, suspendMedia]);

  return (
    <section
      ref={(node) => { nodeRef.current = node; }}
      aria-labelledby="showreel-heading"
      className="relative min-h-[100svh] overflow-hidden"
    >
      <video
        ref={videoRef}
        src="/ShowReel_SC.mp4"
        autoPlay
        muted
        loop
        playsInline
        disablePictureInPicture
        preload="auto"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${inView && !suspendMedia ? "opacity-100" : "opacity-0"}`}
      />
      
      <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(0,0,0,0.22)_0%,rgba(0,0,0,0.38)_48%,rgba(5,6,8,0.92)_100%)]" />

      <div
        className={`relative z-20 flex min-h-[100svh] items-end px-4 pb-12 sm:px-6 md:px-12 ${
          isTouchLayout ? "justify-start" : "justify-end"
        }`}
      >
        <div className="max-w-2xl rounded-[24px] border border-white/10 bg-black/40 p-5 backdrop-blur-xl sm:rounded-[32px] sm:p-6 md:p-8">
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/50">Showreel</p>
          <h2 id="showreel-heading" className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-5xl">
            Moments people can feel.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/70 md:text-base">
            Selected scenes from interactive installations, UX/UI, and 3D motion storytelling.
          </p>
        </div>
      </div>
    </section>
  );
};

export default memo(ShowreelSection);
