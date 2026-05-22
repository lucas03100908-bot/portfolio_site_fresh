"use client";

import { memo, type MouseEvent, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useMotionValue } from "framer-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useGyroTilt } from "@/hooks/use-gyro-tilt";
import { ProfileLinkSelector } from "./ProfileLinkSelector";
import { TextEffect } from "@/components/ui/text-effect";
import { ParallaxTiltCard } from "@/components/ui/parallax-tilt-card";

const SpiderThermalEffect = dynamic(
  () => import("@/components/ui/spider-thermal-effect").then((mod) => mod.SpiderThermalEffect),
  { ssr: false, loading: () => <div className="h-full w-full bg-white/5 animate-pulse rounded-full" /> }
);

const LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/mho.xxv/" },
  { label: "Threads",   href: "https://www.threads.net/@mho.xxv" },
  { label: "YouTube",   href: "https://youtube.com/channel/UCzvEbjghgfUZaj2v-uLIVjw?si=vvMZktWc3uFfq0Ug" },
];

const OUTER_HEX_SIZE = 800;
const INNER_HEX_SIZE = 700;
const OUTER_HEX_PATH = "M 400,36 L 715,218 L 715,582 L 400,764 L 85,582 L 85,218 Z";
const HEX_OBJECT_OFFSET_X = 175;
const BACK_HEX_LAYER_SCALE = 0.95;
const FRONT_HEX_LAYER_SCALE = 0.92;
const TILT_RESPONSE_RADIUS = 520;
const TILT_MAX_DEGREES = 18;

interface ProfileSectionProps {
  onVisibilityChange?: (isVisible: boolean) => void;
  isTouchLayout?: boolean;
  suspendMedia?: boolean;
}

const ProfileSection = ({ onVisibilityChange, isTouchLayout = false, suspendMedia = false }: ProfileSectionProps) => {
  const { nodeRef, isIntersecting } = useIntersectionObserver({ threshold: 0.45 });
  const [showHint, setShowHint] = useState(false);
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const { permissionState, requestPermission } = useGyroTilt(tiltX, tiltY, isTouchLayout, isIntersecting);

  const handleTiltMove = (event: MouseEvent<HTMLElement>) => {
    // Skip heavy calculations if not visible or media suspended
    if (!isIntersecting || suspendMedia) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const offset = isTouchLayout ? 0 : HEX_OBJECT_OFFSET_X;
    const centerX = rect.left + rect.width / 2 + offset;
    const centerY = rect.top + rect.height / 2;
    const normalizedX = Math.max(-0.5, Math.min(0.5, (event.clientX - centerX) / TILT_RESPONSE_RADIUS));
    const normalizedY = Math.max(-0.5, Math.min(0.5, (event.clientY - centerY) / TILT_RESPONSE_RADIUS));

    tiltX.set(normalizedX);
    tiltY.set(normalizedY);
  };

  const handleTiltLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  useEffect(() => {
    if (!onVisibilityChange) return;
    onVisibilityChange(isIntersecting);
  }, [isIntersecting, onVisibilityChange]);

  useEffect(() => {
    if (!isIntersecting || suspendMedia) {
      const resetTimer = window.setTimeout(() => {
        setShowHint(false);
      }, 0);
      return () => window.clearTimeout(resetTimer);
    }

    const showTextTimer = window.setTimeout(() => {
      setShowHint(true);
    }, 120);

    return () => {
      window.clearTimeout(showTextTimer);
    };
  }, [isIntersecting, suspendMedia]);

  return (
    <section
      id="about"
      ref={(node) => {
        nodeRef.current = node;
      }}
      onMouseMove={handleTiltMove}
      onMouseLeave={handleTiltLeave}
      className="relative h-[100svh] w-full overflow-hidden bg-[#F3F4F6]"
    >
      <svg className="pointer-events-none absolute h-0 w-0 overflow-hidden" aria-hidden="true">
        <defs>
          <linearGradient id="outer-hex-fill" x1="10.625%" y1="4.5%" x2="89.375%" y2="95.5%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.98)" />
            <stop offset="55%" stopColor="rgba(238,243,255,0.92)" />
            <stop offset="100%" stopColor="rgba(209,220,247,0.88)" />
          </linearGradient>
        </defs>
      </svg>

      <ParallaxTiltCard
        x={tiltX}
        y={tiltY}
        maxTilt={isTouchLayout && permissionState !== "granted" ? 0 : TILT_MAX_DEGREES}
        className="pointer-events-none absolute left-1/2 top-1/2 z-[12] -translate-x-1/2 -translate-y-1/2 scale-[0.45] transform-gpu md:ml-[175px] md:scale-100"
        style={{
          width: OUTER_HEX_SIZE,
          height: OUTER_HEX_SIZE,
        }}
      >
        <svg
          aria-hidden="true"
          width={OUTER_HEX_SIZE}
          height={OUTER_HEX_SIZE}
          viewBox="0 0 800 800"
          style={{
            transform: `scale(${BACK_HEX_LAYER_SCALE})`,
            transformOrigin: "center center",
          }}
          className="absolute inset-0"
        >
          <path
            d={OUTER_HEX_PATH}
            fill="url(#outer-hex-fill)"
            stroke="rgba(255, 255, 255, 0.9)"
            strokeWidth="1.5"
          />
        </svg>

        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: INNER_HEX_SIZE,
            height: INNER_HEX_SIZE,
            transform: `scale(${FRONT_HEX_LAYER_SCALE})`,
            transformOrigin: "center center",
          }}
        >
          <SpiderThermalEffect 
            width={INNER_HEX_SIZE} 
            height={INNER_HEX_SIZE} 
            paused={!isIntersecting || suspendMedia}
          />
        </div>
      </ParallaxTiltCard>

      {/* Hint text: briefly shown above the hexagon */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 z-30 flex w-[min(19rem,82vw)] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-1.5 text-center md:ml-[175px] md:w-[min(19rem,52vw)]"
      >
        <TextEffect
          per="word"
          preset="blur"
          trigger={showHint}
          className="max-w-[16ch] text-balance font-[family-name:var(--font-geist-sans)] text-[15px] font-extrabold leading-[1.38] tracking-[-0.03em] text-white [text-shadow:0_0_3px_rgba(15,23,42,0.9),0_2px_10px_rgba(0,0,0,0.52)] md:text-[18px]"
        >
          주변 링크를 클릭해 포트폴리오를 탐색해 보세요.
        </TextEffect>
        <TextEffect
          per="word"
          preset="blur"
          trigger={showHint}
          delay={0.26}
          className="max-w-[28ch] text-balance font-[family-name:var(--font-geist-sans)] text-[11px] font-semibold leading-[1.5] tracking-[0.02em] text-white/90 [text-shadow:0_0_2px_rgba(15,23,42,0.85),0_2px_8px_rgba(0,0,0,0.42)] md:text-[12px]"
        >
          Click one of the links around the object to explore more portfolio content.
        </TextEffect>
        {isTouchLayout && permissionState === "pending" && (
          <button
            onClick={(e) => { e.stopPropagation(); requestPermission(); }}
            className="pointer-events-auto mt-2 rounded-full border border-white/30 bg-white/15 px-4 py-1.5 font-[family-name:var(--font-geist-sans)] text-[11px] font-semibold text-white/90 backdrop-blur-sm transition-transform active:scale-95 [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]"
          >
            ↕ 자이로 센서로 틸트 조작하기
          </button>
        )}
        {isTouchLayout && permissionState === "denied" && (
          <p className="pointer-events-none mt-1 font-[family-name:var(--font-geist-sans)] text-[10px] text-white/50">
            설정 &gt; Safari &gt; 모션 및 방향 접근 허용
          </p>
        )}
      </div>

      {/* Marquee: fills entire section, below ring + hexagon */}
      <div className="pointer-events-auto absolute inset-0 z-10">
        <ProfileLinkSelector
          links={LINKS}
          linkClassName={isTouchLayout ? "text-[3.3svh] leading-none" : "text-[4.6svh] leading-none"}
          theme="light"
          isTouchLayout={isTouchLayout}
          active={isIntersecting && !suspendMedia}
        />
      </div>
    </section>
  );
};

export default memo(ProfileSection);
