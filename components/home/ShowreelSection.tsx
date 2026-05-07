"use client";

import { memo, useRef, useEffect, useState } from "react";

interface ShowreelSectionProps {
  isTouchLayout: boolean;
  suspendMedia?: boolean;
}

const ShowreelSection = ({ isTouchLayout, suspendMedia = false }: ShowreelSectionProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setInView(entries.some((entry) => entry.isIntersecting));
      },
      { rootMargin: "200px 0px", threshold: 0.01 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (inView && !suspendMedia) {
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [inView, suspendMedia]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="showreel-heading"
      className="relative min-h-[100svh] overflow-hidden"
    >
      {inView && (
        <video
          ref={videoRef}
          src="/ShowReel_SC.mp4"
          autoPlay
          muted
          loop
          playsInline
          controls
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
        />
      )}
      
      <div className="pointer-events-none absolute inset-0 bg-black/40 z-10" />

      <div
        className={`relative z-20 flex min-h-[100svh] items-end px-4 pb-12 sm:px-6 md:px-12 ${
          isTouchLayout ? "justify-start" : "justify-end"
        }`}
      >
        <div className="max-w-2xl rounded-[32px] border border-white/10 bg-black/40 p-6 backdrop-blur-xl md:p-8">
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/50">Showreel</p>
          <h2 id="showreel-heading" className="mt-4 text-3xl font-bold tracking-tight text-white md:text-5xl">
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
