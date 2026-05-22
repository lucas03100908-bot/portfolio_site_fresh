"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CategoryInfo, ProjectItem } from "@/lib/types";
import { CategoryHeader } from "./CategoryHeader";
import CategoryProjectDetailPanel from "./CategoryProjectDetailPanel";
import { CategoryProjectGrid } from "./CategoryProjectGrid";
import { ProjectListHeader } from "./ProjectListHeader";

interface CategoryPanelContentProps {
  category: CategoryInfo;
  isTouchLayout: boolean;
  selectedProject: ProjectItem | null;
  onClosePanel: () => void;
  onProjectClear: () => void;
  onProjectSelect: (project: ProjectItem) => void;
}

export default function CategoryPanelContent({
  category,
  isTouchLayout,
  selectedProject,
  onClosePanel,
  onProjectClear,
  onProjectSelect,
}: CategoryPanelContentProps) {
  // Touch layout: grid always visible, detail slides up as a bottom sheet overlay
  if (isTouchLayout) {
    return (
      <>
        <CategoryHeader category={category} />

        <ProjectListHeader isTouchLayout={true} />

        <div className="mt-5">
          <div
            aria-hidden={Boolean(selectedProject)}
            className={`transition-[filter,opacity] duration-200 ${
              selectedProject ? "pointer-events-none opacity-35 blur-[1.5px]" : "opacity-100"
            }`}
          >
            <CategoryProjectGrid
              category={category}
              selectedProjectTitle={selectedProject?.title ?? null}
              onProjectSelect={onProjectSelect}
            />
          </div>
        </div>

        <AnimatePresence>
          {selectedProject ? (
            <motion.button
              key="project-detail-backdrop"
              type="button"
              aria-label="Close project detail"
              className="fixed inset-0 z-[45] bg-[#02060b]/54 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.2 } }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              onClick={onProjectClear}
            />
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {selectedProject ? (
            <CategoryProjectDetailPanel
              key={selectedProject.title}
              project={selectedProject}
              accentColor={category.color}
              accentMid={category.mid}
              isTouchLayout={true}
              layoutMode="bottom-sheet"
              onBack={onProjectClear}
              onClosePanel={onClosePanel}
            />
          ) : null}
        </AnimatePresence>
      </>
    );
  }

  // Desktop: switch between grid view and full-panel detail view
  return (
    <>
      {!selectedProject && (
        <motion.div
          key="grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }}
        >
          <CategoryHeader category={category} />

          <ProjectListHeader isTouchLayout={false} />

          <div className="mt-5 md:mt-6">
            <CategoryProjectGrid
              category={category}
              selectedProjectTitle={null}
              onProjectSelect={onProjectSelect}
            />
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {selectedProject ? (
          <CategoryProjectDetailPanel
            key={selectedProject.title}
            project={selectedProject}
            accentColor={category.color}
            accentMid={category.mid}
            isTouchLayout={false}
            layoutMode="full-panel"
            onBack={onProjectClear}
            onClosePanel={onClosePanel}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
