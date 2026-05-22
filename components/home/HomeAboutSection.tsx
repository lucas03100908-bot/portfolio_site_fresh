"use client";

import { memo } from "react";
import dynamic from "next/dynamic";

const ShowreelSection = dynamic(() => import("./ShowreelSection"), {
  ssr: false,
  loading: () => <div className="min-h-[100svh] bg-[#02060b] animate-pulse" />,
});

const ProfileSection = dynamic(() => import("./ProfileSection"), {
  ssr: false,
  loading: () => <div className="min-h-[100svh] bg-[#F3F4F6] animate-pulse" />,
});

interface HomeAboutSectionProps {
  isTouchLayout: boolean;
  onProfileVisibleChange?: (isActive: boolean) => void;
  suspendMedia?: boolean;
}

function HomeAboutSection({
  isTouchLayout,
  onProfileVisibleChange,
  suspendMedia = false,
}: HomeAboutSectionProps) {
  return (
    <div className="relative z-20">
      {/* 1. Dark Showreel Experience */}
      <ShowreelSection 
        isTouchLayout={isTouchLayout} 
        suspendMedia={suspendMedia} 
      />

      {/* 2. Transition to Light Profile Experience */}
      <ProfileSection 
        isTouchLayout={isTouchLayout}
        onVisibilityChange={onProfileVisibleChange} 
        suspendMedia={suspendMedia}
      />
    </div>
  );
}

export default memo(HomeAboutSection);
