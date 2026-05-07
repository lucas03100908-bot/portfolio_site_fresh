"use client";

import { memo } from "react";

interface AtmosphereLayerProps {
  isHovering: boolean;
  isTransitioning: boolean;
  panelOpen: boolean;
}

const AtmosphereLayer = ({ isHovering, isTransitioning, panelOpen }: AtmosphereLayerProps) => {
  return (
    <>
      {/* 1. Dark Atmosphere (Base color) */}
      <div 
        className={`absolute inset-0 bg-[#02060b] transition-opacity duration-700 pointer-events-none ${
          isHovering ? "opacity-60" : (isTransitioning ? "opacity-68" : "opacity-16")
        }`} 
      />

      {/* 2. Depth Texture (Gradients) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.05)_0%,transparent_30%),linear-gradient(180deg,rgba(3,6,10,0)_0%,rgba(3,6,10,0.4)_50%,rgba(2,5,9,0.9)_100%)] pointer-events-none" />

      {/* 3. Panel Overlay (When category is selected) */}
      <div
        className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
          panelOpen ? "bg-[#04070d]/80 opacity-100" : "opacity-0"
        }`}
      />
    </>
  );
};

export default memo(AtmosphereLayer);
