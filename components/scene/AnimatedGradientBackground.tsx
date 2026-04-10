"use client";

import { memo } from "react";
import { categoryMap } from "@/lib/constants";
import { CategoryKey } from "@/lib/types";

function AnimatedGradientBackground({
  category,
}: {
  category: CategoryKey | null;
}) {
  const info = category ? categoryMap[category] : null;

  return (
    <div
      className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${
        info ? "opacity-100" : "opacity-0"
      }`}
    >
      <style jsx global>{`
        @keyframes mistA {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(28px, -20px, 0) scale(1.08);
          }
        }
        @keyframes mistB {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(-36px, 22px, 0) scale(1.12);
          }
        }
      `}</style>
      {info && (
        <>
          <div
            className="absolute inset-[-16%] animate-[mistA_18s_ease-in-out_infinite] will-change-transform"
            style={{
              background: `
                radial-gradient(circle at 50% 48%, rgba(178,232,255,0.10) 0%, rgba(72,146,214,0.06) 18%, transparent 42%),
                radial-gradient(circle at 18% 24%, ${info.backgroundGradient[0]}20 0%, transparent 32%),
                radial-gradient(circle at 80% 18%, ${info.backgroundGradient[1]}18 0%, transparent 30%),
                radial-gradient(circle at 72% 78%, ${info.backgroundGradient[2]}14 0%, transparent 32%),
                radial-gradient(circle at 28% 82%, ${info.backgroundGradient[3]}10 0%, transparent 32%)
              `,
              filter: "blur(96px)",
              mixBlendMode: "screen",
            }}
          />
          <div
            className="absolute inset-[-18%] animate-[mistB_24s_ease-in-out_infinite] will-change-transform"
            style={{
              background: `
                radial-gradient(circle at 52% 50%, rgba(183,236,255,0.08) 0%, transparent 18%),
                radial-gradient(circle at 34% 36%, rgba(122,214,255,0.05) 0%, transparent 22%),
                radial-gradient(circle at 66% 62%, rgba(122,214,255,0.05) 0%, transparent 24%)
              `,
              filter: "blur(120px)",
              mixBlendMode: "screen",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 50% 50%, rgba(122,224,255,0.08) 0%, rgba(75,156,220,0.03) 12%, transparent 30%),
                radial-gradient(circle at 50% 50%, transparent 0%, rgba(4,10,18,0.12) 34%, rgba(2,6,12,0.62) 72%, rgba(0,0,0,0.94) 100%)
              `,
            }}
          />
        </>
      )}
    </div>
  );
}

export default memo(AnimatedGradientBackground);
