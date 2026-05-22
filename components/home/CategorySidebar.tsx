"use client";

import { memo } from "react";
import { motion } from "framer-motion";

import { categories, categoryMap } from "@/lib/categories";
import { CategoryKey } from "@/lib/types";
import { CategorySidebarItem } from "./CategorySidebarItem";

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

interface CategorySidebarProps {
  activeCategory: CategoryKey | null;
  isTouchLayout: boolean;
  layoutMode?: "overlay" | "sticky" | "fixed";
  theme?: "dark" | "light";
  onReset: () => void;
  onCategoryHover: (category: CategoryKey) => void;
  onCategoryHoverClear: () => void;
  onCategoryPressStart: (category: CategoryKey) => void;
  onCategorySelect: (category: CategoryKey) => void;
}

function CategorySidebar({
  activeCategory,
  isTouchLayout,
  layoutMode = "overlay",
  theme = "dark",
  onReset,
  onCategoryHover,
  onCategoryHoverClear,
  onCategoryPressStart,
  onCategorySelect,
}: CategorySidebarProps) {
  const activeData = activeCategory ? categoryMap[activeCategory] : null;
  const isLightTheme = theme === "light";
  const containerClassName = isTouchLayout
    ? "absolute inset-x-5 top-[calc(env(safe-area-inset-top)+1.5rem)] bottom-[calc(env(safe-area-inset-bottom)+1.5rem)] z-30 overflow-y-auto pr-1 pb-6"
    : layoutMode === "fixed"
      ? "fixed left-4 top-0 z-30 flex h-[100svh] w-[min(36vw,560px)] flex-col overflow-y-auto pt-10 pb-8 pr-4 md:left-10"
    : layoutMode === "sticky"
      ? "sticky top-0 z-30 flex h-[100svh] max-w-[560px] flex-col justify-start pt-10 pb-8"
      : "absolute left-4 right-4 top-4 z-30 max-w-none md:left-10 md:right-auto md:top-10 md:max-w-[560px]";

  return (
    <div className={containerClassName}>
      {/* eyebrow */}
      <p className={`text-[10px] uppercase tracking-[0.38em] md:text-xs md:tracking-[0.48em] ${
        isLightTheme ? "text-black/35" : "text-white/30"
      }`}>
        Portfolio
      </p>

      {/* name */}
      <h1 className={`mt-2 font-bold leading-none tracking-[-0.05em] md:mt-3 ${
        isLightTheme ? "text-black" : "text-white"
      }`}
        style={{
          fontSize: isTouchLayout
            ? "clamp(30px, 9vw, 42px)"
            : "clamp(28px, 3.8vw, 58px)",
        }}>
          <button
            type="button"
            onClick={onReset}
            className="rounded-md text-inherit transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          >
            Kim Minho
          </button>
      </h1>

      {/* role */}
      <p className={`mt-1 text-sm leading-tight tracking-[0.02em] md:text-base ${
        isLightTheme ? "text-black/44" : "text-white/38"
      }`}>
        Digital Media Designer
      </p>

      {/* separator */}
      <div className={`mt-5 h-px w-8 md:mt-7 ${isLightTheme ? "bg-black/14" : "bg-white/15"}`} />

      {/* category list */}
      <motion.div
        className="mt-4 flex flex-col items-start gap-0 md:mt-5"
        onMouseLeave={onCategoryHoverClear}
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        {categories.map((category) => (
          <CategorySidebarItem
            key={category.key}
            categoryKey={category.key}
            label={category.menuLabel}
            isActive={activeCategory === category.key}
            isTouchLayout={isTouchLayout}
            theme={theme}
            onHover={onCategoryHover}
            onPressStart={onCategoryPressStart}
            onSelect={onCategorySelect}
          />
        ))}
      </motion.div>

      {/* active category description */}
      {activeData && !isTouchLayout ? (
        <div className="mt-6 max-w-[19rem] md:mt-9 md:max-w-[24rem]">
          <p className={`text-[10px] uppercase tracking-[0.36em] md:text-xs ${
            isLightTheme ? "text-black/32" : "text-white/28"
          }`}>
            Currently Viewing
          </p>
          <h2 className={`mt-1.5 font-semibold leading-tight tracking-[-0.04em] md:mt-2 ${
            isLightTheme ? "text-black" : "text-white"
          }`}
            style={{ fontSize: "clamp(18px, 2vw, 30px)" }}>
            {activeData.name}
          </h2>
          <p className={`mt-2 text-sm leading-6 md:text-sm md:leading-7 ${
            isLightTheme ? "text-black/50" : "text-white/45"
          }`}>
            {activeData.description}
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default memo(CategorySidebar);
