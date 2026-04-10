"use client";

import React, { memo } from "react";
import Image from "next/image";
import { categoryMap } from "@/lib/constants";
import { HoverPreviewState } from "@/lib/types";

interface PreviewBridgeProps {
  hoverPreview: HoverPreviewState;
  panelOpen: boolean;
}

function PreviewBridge({
  hoverPreview,
  panelOpen,
}: PreviewBridgeProps) {
  const visible = hoverPreview !== null && !panelOpen;
  const info = hoverPreview ? categoryMap[hoverPreview.category] : null;

  const anchorX = hoverPreview?.x ?? 0;
  const anchorY = hoverPreview?.y ?? 0;
  const side = hoverPreview?.side ?? "right";

  const panelWidth = 260;
  const offsetX = side === "right" ? 34 : -(panelWidth + 34);
  const offsetY = -90;
  const panelLeft = anchorX + offsetX;
  const panelTop = anchorY + offsetY;

  const lineWidth = 28;
  const lineLeft = side === "right" ? anchorX + 6 : anchorX - lineWidth - 6;
  const lineTop = anchorY - 1;

  if (!info || !hoverPreview) return null;

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-20 transition-opacity duration-300 ease-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className="absolute h-px bg-white/60 transition-all duration-300"
        style={{
          left: `${lineLeft}px`,
          top: `${lineTop}px`,
          width: `${lineWidth}px`,
        }}
      />
      <div
        className="absolute h-3 w-3 -translate-y-1/2 rounded-full transition-all duration-300"
        style={{
          left: `${anchorX}px`,
          top: `${anchorY}px`,
          background: `radial-gradient(circle at 35% 30%, #ffffff 0%, ${info.mid} 35%, ${info.core} 75%, ${info.core} 100%)`,
          boxShadow: `0 0 20px ${info.color}`,
        }}
      />
      <div
        className={`absolute w-[260px] rounded-[24px] border bg-black/50 p-4 text-white backdrop-blur-xl transition-all duration-300 ease-out ${info.border} ${info.glow} ${
          visible
            ? "translate-x-0 translate-y-0 scale-100"
            : side === "right"
            ? "translate-x-3 translate-y-1 scale-95"
            : "-translate-x-3 translate-y-1 scale-95"
        }`}
        style={{
          left: `${panelLeft}px`,
          top: `${panelTop}px`,
          width: `${panelWidth}px`,
        }}
      >
        {info.hoverVideo ? (
          <div className="mb-3 h-28 overflow-hidden rounded-[18px] bg-white/5">
            <video
              src={info.hoverVideo}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="h-full w-full object-cover"
            />
          </div>
        ) : info.hoverImage ? (
          <div className="relative mb-3 h-28 overflow-hidden rounded-[18px] bg-white/5">
            <Image
              src={info.hoverImage}
              alt={info.name}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div
            className="mb-3 h-28 rounded-[18px]"
            style={{
              background: `radial-gradient(circle at 30% 20%, ${info.mid}88, transparent 38%), radial-gradient(circle at 70% 65%, ${info.color}55, transparent 42%), linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.03))`,
            }}
          />
        )}

        <p className="text-xs uppercase tracking-[0.3em] text-white/45">
          Preview
        </p>
        <h3 className="mt-2 text-lg font-semibold">{info.name}</h3>

        <div className="mt-3 space-y-2">
          {info.preview.map((item) => (
            <div
              key={item}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/75"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(PreviewBridge);
