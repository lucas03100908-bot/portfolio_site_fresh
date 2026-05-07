"use client";

import { useEffect, useRef, memo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface CosmicSpectrumProps {
  color?:
    | "original"
    | "blue-pink"
    | "blue-orange"
    | "sunset"
    | "purple"
    | "monochrome"
    | "pink-purple"
    | "blue-black"
    | "beige-black";
  blur?: boolean;
}

const colorThemes = {
  original: ["#340B05", "#0358F7", "#5092C7", "#E1ECFE", "#FFD400", "#FA3D1D", "#FD02F5", "#FFC0FD"],
  "blue-pink": ["#1E3A8A", "#3B82F6", "#A855F7", "#EC4899", "#F472B6", "#F9A8D4", "#FBCFE8", "#FDF2F8"],
  "blue-orange": ["#1E40AF", "#3B82F6", "#60A5FA", "#FFFFFF", "#FED7AA", "#FB923C", "#EA580C", "#9A3412"],
  sunset: ["#FEF3C7", "#FCD34D", "#F59E0B", "#D97706", "#B45309", "#92400E", "#78350F", "#451A03"],
  purple: ["#F3E8FF", "#E9D5FF", "#D8B4FE", "#C084FC", "#A855F7", "#9333EA", "#7C3AED", "#6B21B6"],
  monochrome: ["#1A1A1A", "#404040", "#666666", "#999999", "#CCCCCC", "#E5E5E5", "#F5F5F5", "#FFFFFF"],
  "pink-purple": ["#FDF2F8", "#FCE7F3", "#F9A8D4", "#F472B6", "#EC4899", "#BE185D", "#831843", "#500724"],
  "blue-black": ["#000000", "#0F172A", "#1E293B", "#334155", "#475569", "#64748B", "#94A3B8", "#CBD5E1"],
  "beige-black": ["#FEF3C7", "#F59E0B", "#D97706", "#92400E", "#451A03", "#1C1917", "#0C0A09", "#000000"],
};

function CosmicSpectrum({ color = "blue-black", blur = true }: CosmicSpectrumProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      tl.fromTo(svgRef.current, 
        { scaleY: 0, opacity: 0, y: 100 },
        { scaleY: 1, opacity: 1, y: 0, ease: "power2.out", duration: 1 }
      );

      // Add atmospheric brightening effect to the parent trigger
      tl.to(".atmosphere-overlay", {
        opacity: 0.4,
        duration: 0.5,
      }, 0.2);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const currentColors = colorThemes[color];

  return (
    <div ref={containerRef} className="relative w-full h-[60vh] overflow-hidden pointer-events-none">
      <div
        ref={svgRef}
        className="absolute inset-0 w-full h-full will-change-transform"
        style={{ transformOrigin: "bottom" }}
      >
        <svg className="w-full h-full" viewBox="0 0 1567 584" preserveAspectRatio="none" fill="none">
          <g filter={blur ? "url(#cosmic-blur)" : undefined}>
            <path d="M1219 584H1393V184H1219V584Z" fill="url(#cosmic-grad0)" />
            <path d="M1045 584H1219V104H1045V584Z" fill="url(#cosmic-grad1)" />
            <path d="M348 584H174L174 184H348L348 584Z" fill="url(#cosmic-grad2)" />
            <path d="M522 584H348L348 104H522L522 584Z" fill="url(#cosmic-grad3)" />
            <path d="M697 584H522L522 54H697L697 584Z" fill="url(#cosmic-grad4)" />
            <path d="M870 584H1045V54H870V584Z" fill="url(#cosmic-grad5)" />
            <path d="M870 584H697L697 0H870L870 584Z" fill="url(#cosmic-grad6)" />
            <path d="M174 585H0.000183105L-3.75875e-06 295H174L174 585Z" fill="url(#cosmic-grad7)" />
            <path d="M1393 584H1567V294H1393V584Z" fill="url(#cosmic-grad8)" />
          </g>
          <defs>
            <filter id="cosmic-blur" x="-50" y="-50" width="1700" height="700" filterUnits="userSpaceOnUse">
              <feGaussianBlur stdDeviation="25" />
            </filter>
            {Array.from({ length: 9 }, (_, i) => (
              <linearGradient key={i} id={`cosmic-grad${i}`} x1="50%" y1="100%" x2="50%" y2="0%">
                <stop stopColor={currentColors[0]} />
                <stop offset="0.2" stopColor={currentColors[1]} />
                <stop offset="0.4" stopColor={currentColors[2]} />
                <stop offset="0.6" stopColor={currentColors[4]} />
                <stop offset="0.8" stopColor={currentColors[6]} />
                <stop offset="1" stopColor={currentColors[7]} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>
        </svg>
      </div>
    </div>
  );
}

export default memo(CosmicSpectrum);
