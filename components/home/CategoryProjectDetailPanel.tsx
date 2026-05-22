"use client";

import { motion } from "framer-motion";
import { ProjectItem } from "@/lib/types";
import { ProjectDetailHeader } from "./project-detail/ProjectDetailHeader";
import { ProjectDetailMedia } from "./project-detail/ProjectDetailMedia";
import { ProjectDetailInfo } from "./project-detail/ProjectDetailInfo";

interface CategoryProjectDetailPanelProps {
  project: ProjectItem;
  accentColor: string;
  accentMid: string;
  isTouchLayout: boolean;
  layoutMode?: "sidebar" | "bottom-sheet" | "full-panel";
  onBack: () => void;
  onClosePanel: () => void;
}

export default function CategoryProjectDetailPanel({
  project,
  accentColor,
  accentMid,
  isTouchLayout,
  layoutMode = isTouchLayout ? "bottom-sheet" : "full-panel",
  onBack,
  onClosePanel,
}: CategoryProjectDetailPanelProps) {
  const enterEase: [number, number, number, number] = [0.22, 1, 0.36, 1];
  const exitEase: [number, number, number, number] = [0.3, 0, 0.66, 0.33];
  const isBottomSheet = layoutMode === "bottom-sheet";
  const isFullPanel = layoutMode === "full-panel";

  const panelClassName = isBottomSheet
    ? "fixed inset-x-0 bottom-0 z-[50] flex max-h-[82svh] flex-col overflow-hidden rounded-t-[28px] border-t border-white/12 bg-[#0b1019]/98 shadow-[0_-20px_56px_rgba(0,0,0,0.4)]"
    : isFullPanel
    ? "mt-5 md:mt-6 flex w-full flex-col overflow-hidden rounded-[28px] border border-white/12 bg-[#0b1019]/98 shadow-[0_22px_64px_rgba(0,0,0,0.34)] max-h-[calc(100svh-9rem)]"
    : "relative z-10 flex w-full min-w-0 flex-col overflow-hidden rounded-[28px] border border-white/12 bg-[#0b1019]/98 shadow-[0_22px_64px_rgba(0,0,0,0.34)] xl:sticky xl:top-4 xl:max-h-[calc(100svh-10rem)]";

  const scrollerClassName = isBottomSheet
    ? "overflow-y-auto px-5 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] pt-5"
    : "overflow-y-auto px-5 pb-6 pt-5 md:px-6";

  return (
    <motion.div
      role="dialog"
      aria-modal={isBottomSheet ? "true" : undefined}
      aria-label={`${project.title} details`}
      data-detail-layout={layoutMode}
      className={panelClassName}
      initial={isBottomSheet ? { opacity: 0, y: 32 } : isFullPanel ? { opacity: 0, y: 12, scale: 0.99 } : { opacity: 0, x: 24, scale: 0.98 }}
      animate={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        transition: { duration: 0.35, ease: enterEase },
      }}
      exit={
        isBottomSheet
          ? { opacity: 0, y: 32, transition: { duration: 0.25, ease: exitEase } }
          : isFullPanel
          ? { opacity: 0, y: 12, scale: 0.99, transition: { duration: 0.2, ease: exitEase } }
          : { opacity: 0, x: 28, scale: 0.98, transition: { duration: 0.25, ease: exitEase } }
      }
    >
      {isBottomSheet ? (
        <div className="flex justify-center pt-3">
          <div className="h-1.5 w-12 rounded-full bg-white/18" />
        </div>
      ) : null}

      <ProjectDetailHeader
        project={project}
        onBack={onBack}
        onClosePanel={onClosePanel}
      />

      <div className={scrollerClassName}>
        <ProjectDetailMedia
          project={project}
          accentColor={accentColor}
          accentMid={accentMid}
        />
        <ProjectDetailInfo project={project} />
      </div>
    </motion.div>
  );
}