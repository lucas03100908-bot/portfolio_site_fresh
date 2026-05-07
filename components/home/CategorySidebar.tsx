"use client";

import { memo, useEffect, useRef } from "react";
import { motion } from "framer-motion";

import { categories, categoryMap } from "@/lib/categories";
import { CategoryKey } from "@/lib/types";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const itemEase: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: itemEase } },
};

interface CategoryItemProps {
  categoryKey: CategoryKey;
  label: string;
  isActive: boolean;
  onHover: (key: CategoryKey) => void;
  onPressStart: (key: CategoryKey) => void;
  onSelect: (key: CategoryKey) => void;
}

const CategoryItem = memo(function CategoryItem({
  categoryKey,
  label,
  isActive,
  onHover,
  onPressStart,
  onSelect,
}: CategoryItemProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  const scrambleRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startScramble = () => {
    let iter = 0;
    if (scrambleRef.current) clearInterval(scrambleRef.current);
    scrambleRef.current = setInterval(() => {
      if (textRef.current) {
        textRef.current.textContent = label
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (i < Math.floor(iter)) return label[i];
            return LETTERS[Math.floor(Math.random() * 26)];
          })
          .join("");
      }
      if (iter >= label.length) {
        clearInterval(scrambleRef.current!);
        scrambleRef.current = null;
        if (textRef.current) textRef.current.textContent = label;
      }
      iter += 1 / 3;
    }, 25);
  };

  const stopScramble = () => {
    if (scrambleRef.current) {
      clearInterval(scrambleRef.current);
      scrambleRef.current = null;
    }
    if (textRef.current) textRef.current.textContent = label;
  };

  const handleMouseEnter = () => {
    startScramble();
    onHover(categoryKey);
  };

  const handleMouseLeave = () => {
    stopScramble();
  };

  useEffect(() => {
    return () => {
      if (scrambleRef.current) clearInterval(scrambleRef.current);
    };
  }, []);

  return (
    <motion.button
      variants={itemVariants}
      type="button"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={() => onHover(categoryKey)}
      onPointerDown={() => onPressStart(categoryKey)}
      onClick={() => onSelect(categoryKey)}
      aria-expanded={isActive}
      className="relative w-full touch-manipulation py-[3px] text-left"
    >
      <span
        className={`relative block overflow-hidden font-bold leading-none tracking-[-0.04em] transition-colors duration-200 ${
          isActive ? "text-white" : "text-white/40"
        }`}
        style={{ fontSize: "clamp(28px, 3.3vw, 50px)" }}
      >
        <span ref={textRef}>{label}</span>
      </span>
    </motion.button>
  );
});

CategoryItem.displayName = "CategoryItem";

interface CategorySidebarProps {
  activeCategory: CategoryKey | null;
  isTouchLayout: boolean;
  layoutMode?: "overlay" | "sticky" | "fixed";
  onCategoryHover: (category: CategoryKey) => void;
  onCategoryHoverClear: () => void;
  onCategoryPressStart: (category: CategoryKey) => void;
  onCategorySelect: (category: CategoryKey) => void;
}

function CategorySidebar({
  activeCategory,
  isTouchLayout,
  layoutMode = "overlay",
  onCategoryHover,
  onCategoryHoverClear,
  onCategoryPressStart,
  onCategorySelect,
}: CategorySidebarProps) {
  const activeData = activeCategory ? categoryMap[activeCategory] : null;
  const containerClassName = isTouchLayout
    ? "absolute inset-x-4 top-4 bottom-[calc(env(safe-area-inset-bottom)+1rem)] z-30 overflow-y-auto pr-1 pb-3 md:left-10 md:right-auto md:top-10 md:bottom-auto md:max-w-[560px]"
    : layoutMode === "fixed"
      ? "fixed left-4 top-0 z-30 flex h-[100svh] w-[min(36vw,560px)] flex-col overflow-y-auto pt-10 pb-8 pr-4 md:left-10"
    : layoutMode === "sticky"
      ? "sticky top-0 z-30 flex h-[100svh] max-w-[560px] flex-col justify-start pt-10 pb-8"
      : "absolute left-4 right-4 top-4 z-30 max-w-none md:left-10 md:right-auto md:top-10 md:max-w-[560px]";

  return (
    <div className={containerClassName}>
      {/* eyebrow */}
      <p className="text-[10px] uppercase tracking-[0.38em] text-white/30 md:text-xs md:tracking-[0.48em]">
        Portfolio
      </p>

      {/* name */}
      <h1 className="mt-2 font-bold leading-none tracking-[-0.05em] text-white md:mt-3"
        style={{ fontSize: "clamp(28px, 3.8vw, 58px)" }}>
        Kim Minho
      </h1>

      {/* role */}
      <p className="mt-1 text-sm leading-tight tracking-[0.02em] text-white/38 md:text-base">
        Digital Media Designer
      </p>

      {/* separator */}
      <div className="mt-5 h-px w-8 bg-white/15 md:mt-7" />

      {/* category list */}
      <motion.div
        className="mt-4 flex flex-col items-start gap-0 md:mt-5"
        onMouseLeave={onCategoryHoverClear}
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        {categories.map((category) => (
          <CategoryItem
            key={category.key}
            categoryKey={category.key}
            label={category.menuLabel}
            isActive={activeCategory === category.key}
            onHover={onCategoryHover}
            onPressStart={onCategoryPressStart}
            onSelect={onCategorySelect}
          />
        ))}
      </motion.div>

      {/* active category description */}
      {activeData && !isTouchLayout ? (
        <div className="mt-6 max-w-[19rem] md:mt-9 md:max-w-[24rem]">
          <p className="text-[10px] uppercase tracking-[0.36em] text-white/28 md:text-xs">
            Currently Viewing
          </p>
          <h2 className="mt-1.5 font-semibold leading-tight tracking-[-0.04em] text-white md:mt-2"
            style={{ fontSize: "clamp(18px, 2vw, 30px)" }}>
            {activeData.name}
          </h2>
          <p className="mt-2 text-sm leading-6 text-white/45 md:text-sm md:leading-7">
            {activeData.description}
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default memo(CategorySidebar);