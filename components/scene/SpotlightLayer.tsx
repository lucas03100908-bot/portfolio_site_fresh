"use client";

import { memo, useEffect, useRef } from "react";

interface SpotlightLayerProps {
  isActive: boolean;
  panelOpen: boolean;
}

const SpotlightLayer = ({ isActive, panelOpen }: SpotlightLayerProps) => {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set initial position
    const layer = layerRef.current;
    if (layer) {
      layer.style.setProperty("--spotlight-x", `${window.innerWidth / 2}px`);
      layer.style.setProperty("--spotlight-y", `${window.innerHeight * 0.36}px`);
    }

    if (!isActive || typeof window === "undefined") return;

    let frameId: number | null = null;
    const setPos = (x: number, y: number) => {
      if (!layer) return;
      layer.style.setProperty("--spotlight-x", `${x}px`);
      layer.style.setProperty("--spotlight-y", `${y}px`);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => setPos(e.clientX, e.clientY));
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [isActive]);

  return (
    <div
      ref={layerRef}
      className={`pointer-events-none absolute inset-0 transform-gpu transition-opacity duration-500 ${
        isActive ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
      style={{
        background: "radial-gradient(circle clamp(200px, 22vw, 320px) at var(--spotlight-x) var(--spotlight-y), rgba(2,5,9,0) 0%, rgba(2,5,9,0) 32%, rgba(2,5,9,0.62) 48%, rgba(2,5,9,0.93) 62%, rgba(1,3,7,0.98) 78%, rgba(0,0,0,1) 100%)",
        opacity: panelOpen ? 0.92 : 1,
      }}
    />
  );
};

export default memo(SpotlightLayer);
