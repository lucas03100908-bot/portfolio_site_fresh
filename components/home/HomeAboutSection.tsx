"use client";

import { memo, useEffect, useRef } from "react";
import ShowreelSection from "./ShowreelSection";
import ProfileSection from "./ProfileSection";

interface HomeAboutSectionProps {
  isTouchLayout: boolean;
  onMediaZoneActiveChange?: (isActive: boolean) => void;
  suspendMedia?: boolean;
}

function HomeAboutSection({
  isTouchLayout,
  onMediaZoneActiveChange,
  suspendMedia = false,
}: HomeAboutSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !onMediaZoneActiveChange) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Media zone is active when any part of about/showreel is visible
        const isVisible = entries.some(entry => entry.isIntersecting);
        onMediaZoneActiveChange(isVisible && window.scrollY > 100);
      },
      { threshold: 0.01 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [onMediaZoneActiveChange]);

  return (
    <div ref={containerRef} className="relative z-20">
      {/* 1. Dark Showreel Experience */}
      <ShowreelSection 
        isTouchLayout={isTouchLayout} 
        suspendMedia={suspendMedia} 
      />

      {/* 2. Transition to Light Profile Experience */}
      <ProfileSection 
        isTouchLayout={isTouchLayout} 
      />
    </div>
  );
}

export default memo(HomeAboutSection);
