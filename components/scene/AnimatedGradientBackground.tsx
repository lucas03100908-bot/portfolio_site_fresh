"use client";

import React, { memo } from "react";
import { categories } from "@/lib/categories";
import { CategoryKey } from "@/lib/types";

// Pre-compute gradient strings at module level — never re-computed on re-render.
const TRANSPARENT_FALLBACK = ["transparent", "transparent", "transparent", "transparent"];

function buildGradient(colors: string[]) {
  return `
    radial-gradient(circle at 50% 48%, rgba(178,232,255,0.08) 0%, rgba(72,146,214,0.04) 22%, transparent 52%),
    radial-gradient(circle at 18% 24%, ${colors[0]}20 0%, transparent 52%),
    radial-gradient(circle at 80% 18%, ${colors[1]}18 0%, transparent 50%),
    radial-gradient(circle at 72% 78%, ${colors[2]}14 0%, transparent 52%),
    radial-gradient(circle at 28% 82%, ${colors[3]}10 0%, transparent 52%)
  `;
}

// One stable object per category — no heap allocation during render.
// mix-blend-mode removed: it forces per-frame CPU blending against the video
// layer which is the primary cause of hover lag.
const GRADIENT_STYLES: Record<string, React.CSSProperties> = Object.fromEntries(
  categories.map((cat) => [
    cat.key,
    {
      background: buildGradient(cat.backgroundGradient ?? TRANSPARENT_FALLBACK),
      willChange: "opacity",
    },
  ])
);

interface GradientLayerProps {
  categoryKey: string;
  isActive: boolean;
  paused: boolean;
}

// Uses visibility:hidden when inactive — no layout recalc (unlike display:none / .hidden)
const GradientLayer = memo(({ categoryKey, isActive, paused }: GradientLayerProps) => {
  const show = isActive && !paused;
  return (
    <div
      className={`absolute inset-[-16%] transition-opacity duration-700 transform-gpu ${
        show ? "opacity-100 animate-[mistA_18s_ease-in-out_infinite]" : "opacity-0"
      }`}
      style={{
        ...GRADIENT_STYLES[categoryKey],
        // visibility:hidden lets GPU skip paint entirely without causing layout recalc
        visibility: show ? "visible" : "hidden",
      }}
    />
  );
});

GradientLayer.displayName = "GradientLayer";

function AnimatedGradientBackground({
  category,
  paused,
  hovering,
}: {
  category: CategoryKey | null;
  paused?: boolean;
  hovering?: boolean;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-transparent">
      {categories.map((cat) => (
        <GradientLayer
          key={cat.key}
          categoryKey={cat.key}
          isActive={category === cat.key}
          paused={Boolean(paused) || Boolean(hovering)}
        />
      ))}

      {/* Static depth vignette — never changes */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 50% 50%, rgba(122,224,255,0.06) 0%, rgba(75,156,220,0.02) 12%, transparent 30%),
            radial-gradient(circle at 50% 50%, transparent 0%, rgba(4,10,18,0.1) 34%, rgba(2,6,12,0.5) 72%, rgba(0,0,0,0.9) 100%)
          `,
        }}
      />
    </div>
  );
}

export default memo(AnimatedGradientBackground);

