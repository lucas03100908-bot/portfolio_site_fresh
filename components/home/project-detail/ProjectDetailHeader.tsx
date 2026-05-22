"use client";

import { ProjectItem } from "@/lib/types";

interface ProjectDetailHeaderProps {
  project: ProjectItem;
  onBack: () => void;
  onClosePanel: () => void;
}

export function ProjectDetailHeader({
  project,
  onBack,
  onClosePanel,
}: ProjectDetailHeaderProps) {
  return (
    <div className="sticky top-0 z-10 border-b border-white/10 bg-[#0b1019]/94 px-5 py-4 backdrop-blur-xl md:px-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/44 md:text-xs">
            Project Detail
          </p>
          <h3 className="mt-2 truncate text-base font-semibold tracking-[-0.03em] text-white md:text-lg">
            {project.title}
          </h3>
          <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.16em] text-white/48 md:text-[12px]">
            {project.subtitle}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="rounded-full border border-white/12 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:border-white/20 hover:bg-white/8 md:text-sm md:normal-case md:tracking-normal"
          >
            Back
          </button>

          <button
            type="button"
            onClick={onClosePanel}
            className="rounded-full border border-white/12 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:border-white/20 hover:bg-white/8 md:text-sm md:normal-case md:tracking-normal"
          >
            Close
          </button>
        </div>
      </div>

      <p className="mt-3 text-[12px] leading-relaxed text-white/56 md:text-[13px]">
        Read the full caption without losing the project list context.
      </p>
    </div>
  );
}
