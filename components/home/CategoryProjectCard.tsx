"use client";

import { memo } from "react";
import { ProjectItem } from "@/lib/types";
import { ProjectCardMedia } from "./project-card/ProjectCardMedia";
import { ProjectCardInfo } from "./project-card/ProjectCardInfo";

interface CategoryProjectCardProps {
  project: ProjectItem;
  accentColor: string;
  accentMid: string;
  isSelected?: boolean;
  priority?: boolean;
  onSelect: (project: ProjectItem) => void;
}

function CategoryProjectCard({
  project,
  accentColor,
  accentMid,
  isSelected = false,
  priority = false,
  onSelect,
}: CategoryProjectCardProps) {
  const cardStyle = {
    contentVisibility: "auto" as const,
    containIntrinsicSize: "320px",
    contain: "layout paint style" as const,
  };

  return (
    <button
      type="button"
      onClick={() => onSelect(project)}
      aria-pressed={isSelected}
      className={`group relative block h-full w-full overflow-hidden rounded-[22px] border p-3 text-left outline-none transition-[transform,border-color,background-color,box-shadow] duration-300 transform-gpu focus-visible:ring-2 focus-visible:ring-white/16 md:rounded-[26px] md:p-4 ${
        isSelected
          ? "border-white/18 bg-white/[0.08] shadow-[0_18px_44px_rgba(0,0,0,0.22)]"
          : "border-white/8 bg-white/[0.04] motion-safe:hover:-translate-y-1 motion-safe:hover:border-white/18 focus-visible:border-white/24"
      }`}
      style={cardStyle}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.025)_56%,rgba(255,255,255,0)_100%)] transition-opacity duration-300 ${
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      />

      <div className="relative z-10 flex h-full flex-col">
        <ProjectCardMedia
          project={project}
          accentColor={accentColor}
          accentMid={accentMid}
          priority={priority}
        />

        <ProjectCardInfo
          project={project}
          isSelected={isSelected}
        />
      </div>
    </button>
  );
}

export default memo(CategoryProjectCard);
