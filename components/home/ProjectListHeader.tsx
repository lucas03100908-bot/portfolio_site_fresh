"use client";

interface ProjectListHeaderProps {
  isTouchLayout: boolean;
}

export function ProjectListHeader({ isTouchLayout }: ProjectListHeaderProps) {
  return (
    <div className="mt-5 rounded-[22px] border border-white/10 bg-white/[0.035] px-4 py-4 md:mt-7 md:rounded-[24px] md:px-5">
      <p className="text-[10px] uppercase tracking-[0.28em] text-white/38 md:text-xs">
        Projects
      </p>
      <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-white/64 md:text-[14px]">
        {isTouchLayout ? "Tap a card to read the full caption." : "Choose a card to read the full caption."}
      </p>
    </div>
  );
}
