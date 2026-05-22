"use client";

import { memo, useEffect } from "react";
import { motion } from "framer-motion";
import { CategoryKey } from "@/lib/types";
import { useScramble } from "@/hooks/use-scramble";

const itemEase: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: itemEase } },
};

interface CategorySidebarItemProps {
  categoryKey: CategoryKey;
  label: string;
  isActive: boolean;
  isTouchLayout?: boolean;
  theme?: "dark" | "light";
  onHover: (key: CategoryKey) => void;
  onPressStart: (key: CategoryKey) => void;
  onSelect: (key: CategoryKey) => void;
}

export const CategorySidebarItem = memo(function CategorySidebarItem({
  categoryKey,
  label,
  isActive,
  isTouchLayout = false,
  theme = "dark",
  onHover,
  onPressStart,
  onSelect,
}: CategorySidebarItemProps) {
  const { textRef, startScramble, stopScramble } = useScramble(label);

  useEffect(() => {
    if (isActive) {
      stopScramble();
    }
  }, [isActive, stopScramble]);

  const handleMouseEnter = () => {
    startScramble();
    onHover(categoryKey);
  };

  const handleMouseLeave = () => {
    stopScramble();
  };

  return (
    <motion.button
      variants={itemVariants}
      type="button"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={() => onHover(categoryKey)}
      onPointerDown={() => {
        stopScramble();
        onPressStart(categoryKey);
      }}
      onClick={() => {
        stopScramble();
        onSelect(categoryKey);
      }}
      aria-expanded={isActive}
      className={`relative w-full touch-manipulation text-left ${
        isTouchLayout ? "py-1.5" : "py-[3px]"
      }`}
    >
      <span
        className={`relative block overflow-hidden font-bold leading-none tracking-[-0.04em] transition-colors duration-200 ${
          isActive
            ? theme === "light"
              ? "text-black"
              : "text-white"
            : theme === "light"
              ? "text-black/42"
              : "text-white/40"
        }`}
        style={{
          fontSize: isTouchLayout
            ? "clamp(32px, 8.5vw, 44px)"
            : "clamp(28px, 3.3vw, 50px)",
        }}
      >
        <span ref={textRef}>{label}</span>
      </span>
    </motion.button>
  );
});

CategorySidebarItem.displayName = "CategorySidebarItem";
