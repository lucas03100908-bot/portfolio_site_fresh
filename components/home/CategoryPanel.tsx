"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

import { CategoryInfo, ProjectItem } from "@/lib/types";

import { loadCategoryPanelContent } from "./loadCategoryPanelContent";
import PanelContentSkeleton from "./PanelContentSkeleton";

interface CategoryPanelProps {
  category: CategoryInfo;
  isTouchLayout: boolean;
  panelBodyReady: boolean;
  onClose: () => void;
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
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const headerClassName = isTouchLayout
    ? "mb-4 flex items-start justify-between gap-4 border-b border-white/10 pb-4 pt-2"
    : "mb-0 flex items-start justify-between gap-4";
  const panelClassName = isTouchLayout
    ? `fixed inset-0 z-40 h-[100svh] w-screen overflow-y-auto overscroll-contain rounded-none bg-[#0a0f18]/94 px-5 pt-[calc(env(safe-area-inset-top)+0.5rem)] pb-[calc(env(safe-area-inset-bottom)+1.5rem)] text-white ${category.glow}`
    : `fixed inset-y-0 right-0 z-40 w-[min(65vw,1040px)] overflow-y-auto overscroll-contain rounded-l-[40px] border-l bg-[#0a0f18]/98 p-8 md:p-10 text-white shadow-[-32px_0_80px_rgba(0,0,0,0.45)] ${category.border}`;

  const enterEase: [number, number, number, number] = [0.22, 1, 0.36, 1];
  const exitEase: [number, number, number, number] = [0.3, 0, 0.66, 0.33];

  const panelVariants = {
    initial: isTouchLayout ? { opacity: 0, y: "100%" } : { x: "100%" },
    animate: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.35, ease: enterEase },
    },
    exit: isTouchLayout
      ? { opacity: 0, y: "100%", transition: { duration: 0.32, ease: exitEase } }
      : { x: "100%", transition: { duration: 0.26, ease: exitEase } },
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
      {isTouchLayout && (
        <div className="mb-4 flex w-full justify-center">
          <div className="h-1.5 w-12 rounded-full bg-white/20" />
        </div>
      )}

      <div className={headerClassName}>
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/38 md:text-xs">
            Selected Category
          </p>
          <h2 className="mt-2 text-base font-semibold tracking-[-0.04em] text-white md:hidden">
            {category.menuLabel}
          </h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="self-start rounded-full border border-white/12 bg-white/5 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-colors active:scale-95 md:px-4 md:py-2 md:text-sm md:normal-case md:tracking-normal"
        >
          Close
        </button>
      </div>

      {panelBodyReady ? (
        <CategoryPanelContent
          category={category}
          isTouchLayout={isTouchLayout}
          selectedProject={selectedProject}
          onClosePanel={onClose}
          onProjectClear={() => setSelectedProject(null)}
          onProjectSelect={setSelectedProject}
        />
      ) : (
        <PanelContentSkeleton />
      )}
    </motion.section>
  );
}