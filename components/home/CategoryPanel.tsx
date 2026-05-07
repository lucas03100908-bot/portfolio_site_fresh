"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";

import { CategoryInfo } from "@/lib/types";

import { loadCategoryPanelContent } from "./loadCategoryPanelContent";

interface CategoryPanelProps {
  category: CategoryInfo;
  isTouchLayout: boolean;
  panelBodyReady: boolean;
  onClose: () => void;
}

function PanelContentSkeleton() {
  return (
    <>
      <div className="relative mt-4 overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.03] md:mt-5 md:rounded-[28px]">
        <div className="relative h-56 sm:h-64 md:h-[320px]">
          <div className="absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_24%_24%,rgba(255,255,255,0.1)_0%,transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.02))]" />
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 md:p-7">
            <div className="h-3 w-20 rounded-full bg-white/12" />
            <div className="mt-3 h-9 w-56 max-w-[70%] rounded-full bg-white/14" />
            <div className="mt-4 h-4 w-full max-w-2xl rounded-full bg-white/10" />
            <div className="mt-2 h-4 w-[78%] max-w-xl rounded-full bg-white/8" />
            <div className="mt-5 flex flex-wrap gap-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`panel-chip-skeleton-${index}`}
                  className="h-7 w-24 animate-pulse rounded-full bg-white/10"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-8 md:gap-5 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={`panel-card-skeleton-${index}`}
            aria-hidden="true"
            className="h-[320px] animate-pulse rounded-[22px] border border-white/8 bg-white/[0.04]"
          />
        ))}
      </div>
    </>
  );
}

const CategoryPanelContent = dynamic(loadCategoryPanelContent, {
  loading: () => <PanelContentSkeleton />,
});

export default function CategoryPanel({
  category,
  isTouchLayout,
  panelBodyReady,
  onClose,
}: CategoryPanelProps) {
  const headerClassName = isTouchLayout
    ? "mb-4 flex items-start justify-between gap-4 border-b border-white/10 pb-4"
    : "mb-0 flex items-start justify-between gap-4";
  const panelClassName = isTouchLayout
    ? `fixed inset-0 z-40 h-[100svh] w-screen overflow-y-auto overscroll-contain rounded-none border-0 bg-[#0a0f18]/92 px-4 pt-[calc(env(safe-area-inset-top)+1rem)] pb-[calc(env(safe-area-inset-bottom)+1rem)] text-white ${category.glow}`
    : `fixed inset-y-[6%] right-[4%] z-40 w-[60%] overflow-y-auto overscroll-contain rounded-[34px] border bg-[#0a0f18] p-8 text-white shadow-[0_24px_72px_rgba(0,0,0,0.3)] ${category.border}`;

  const enterEase: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];
  const exitEase: [number, number, number, number] = [0.55, 0, 1, 0.45];

  const panelVariants = {
    initial: isTouchLayout ? { opacity: 0, y: 32 } : { opacity: 0, x: 32 },
    animate: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.45, ease: enterEase },
    },
    exit: isTouchLayout
      ? { opacity: 0, y: 32, transition: { duration: 0.3, ease: exitEase } }
      : { opacity: 0, x: 32, transition: { duration: 0.3, ease: exitEase } },
  };

  return (
    <motion.section
      aria-busy={!panelBodyReady}
      className={panelClassName}
      variants={panelVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className={headerClassName}>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/38">
            Selected Category
          </p>
          <h2 className="mt-2 text-base font-semibold tracking-[-0.04em] text-white md:hidden">
            {category.menuLabel}
          </h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="self-start rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/68 transition-colors hover:bg-white/10"
        >
          Close
        </button>
      </div>

      {panelBodyReady ? (
        <CategoryPanelContent category={category} />
      ) : (
        <PanelContentSkeleton />
      )}
    </motion.section>
  );
}