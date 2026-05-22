"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useTransform,
  useAnimationFrame,
  useMotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

function wrap(min: number, max: number, v: number): number {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

interface LinkItem {
  label: string;
  href: string;
}

interface MarqueeRowProps {
  links: LinkItem[];
  baseVelocity: number;
  className?: string;
  linkClassName?: string;
  delay?: number;
  isAccessibleRow?: boolean;
  theme?: "dark" | "light";
  active?: boolean;
}

const MARQUEE_COPY_COUNT = 4;
const MARQUEE_REPEAT_PERCENT = 100 / MARQUEE_COPY_COUNT;

function MarqueeRow({
  links,
  baseVelocity = -5,
  className,
  linkClassName,
  delay = 0,
  isAccessibleRow = false,
  theme = "dark",
  active = true,
}: MarqueeRowProps) {
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const baseX = useMotionValue(0);
  const x = useTransform(baseX, (v) => `${wrap(-MARQUEE_REPEAT_PERCENT, 0, v)}%`);
  const directionFactor = useRef<number>(1);
  const hasStarted = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => { hasStarted.current = true; }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useAnimationFrame((_t, delta) => {
    if (!hasStarted.current || !active) return;
    const moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className={cn("flex-1 min-h-0 overflow-hidden whitespace-nowrap flex flex-nowrap items-center", className)}>
      <motion.div
        className="flex whitespace-nowrap flex-nowrap will-change-transform"
        style={{ x }}
      >
        {Array.from({ length: MARQUEE_COPY_COUNT }, (_, i) => {
          const isDecorativeCopy = !isAccessibleRow || i > 0;

          return (
          <span
            key={i}
            aria-hidden={isDecorativeCopy}
            className={cn("block shrink-0 pr-10", linkClassName)}
          >
            {links.map((link, j) => (
              <span key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  tabIndex={isDecorativeCopy ? -1 : undefined}
                  onMouseEnter={() => setHoveredHref(link.href)}
                  onMouseLeave={() => setHoveredHref(null)}
                  className={cn(
                    "font-bold tracking-[-0.06em] leading-none transition-colors duration-300 select-none",
                    hoveredHref === link.href
                      ? "animate-gradient-text bg-[linear-gradient(90deg,#ff4fd8,#ff375f,#ff6a3d,#ffb347,#ff4fd8)] bg-[length:200%_auto] bg-clip-text text-transparent"
                      : theme === "light" ? "text-black" : "text-white",
                    linkClassName
                  )}
                >
                  {link.label}
                </a>
                {j < links.length - 1 && (
                  <span className={cn("mx-4 font-bold", theme === "light" ? "text-black/30" : "text-white/30")}>·</span>
                )}
              </span>
            ))}
          </span>
        );})}
      </motion.div>
    </div>
  );
}

interface ProfileLinkSelectorProps {
  links: LinkItem[];
  className?: string;
  linkClassName?: string;
  theme?: "dark" | "light";
  isTouchLayout?: boolean;
  active?: boolean;
}

const DESKTOP_VELOCITIES = [
  -5, 4, -4.5, 5.5, -4, 4.5, -5.5, 4, -4.5, 5,
  -4, 4.5, -5, 4, -4.5,
];

const TOUCH_VELOCITIES = [-2.8, 2.4, -2.6, 2.7, -2.5, 2.3, -2.7, 2.4];

export function ProfileLinkSelector({
  links,
  className,
  linkClassName,
  theme = "dark",
  isTouchLayout = false,
  active = true,
}: ProfileLinkSelectorProps) {
  const velocities = isTouchLayout ? TOUCH_VELOCITIES : DESKTOP_VELOCITIES;

  return (
    <div className={cn("h-full flex flex-col gap-[2px]", className)}>
      {velocities.map((v, i) => (
        <MarqueeRow
          key={i}
          links={links}
          baseVelocity={v}
          isAccessibleRow={i === 0}
          linkClassName={linkClassName}
          theme={theme}
          delay={i * 40}
          active={active}
        />
      ))}
    </div>
  );
}
