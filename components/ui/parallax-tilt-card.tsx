import * as React from "react";
import type { MotionValue } from "framer-motion";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

import { cn } from "@/lib/utils";

export interface ParallaxTiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  innerClassName?: string;
  maxTilt?: number;
  depth?: number;
  x?: MotionValue<number>;
  y?: MotionValue<number>;
}

const ParallaxTiltCard = React.forwardRef<HTMLDivElement, ParallaxTiltCardProps>(
  (
    {
      children,
      className,
      innerClassName,
      maxTilt = 14,
      depth = 0,
      x: controlledX,
      y: controlledY,
      onMouseMove,
      onMouseLeave,
      style,
      ...props
    },
    ref
  ) => {
    const internalX = useMotionValue(0);
    const internalY = useMotionValue(0);
    const isControlled = controlledX !== undefined && controlledY !== undefined;
    const x = isControlled ? controlledX : internalX;
    const y = isControlled ? controlledY : internalY;

    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30, bounce: 0 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30, bounce: 0 });

    const rotateX = useTransform(
      mouseYSpring,
      [-0.5, 0.5],
      [`${maxTilt}deg`, `-${maxTilt}deg`]
    );
    const rotateY = useTransform(
      mouseXSpring,
      [-0.5, 0.5],
      [`-${maxTilt}deg`, `${maxTilt}deg`]
    );

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
      onMouseMove?.(event);

      if (isControlled) return;

      const rect = event.currentTarget.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      internalX.set(mouseX / rect.width - 0.5);
      internalY.set(mouseY / rect.height - 0.5);
    };

    const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
      onMouseLeave?.(event);

      if (isControlled) return;

      internalX.set(0);
      internalY.set(0);
    };

    return (
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn("relative", className)}
        style={{ ...style, perspective: "2000px" }}
        {...props}
      >
        <motion.div
          style={{
            rotateY,
            rotateX,
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
          className="absolute inset-0"
        >
          <div
            style={{
              transform: `translateZ(${depth}px)`,
              transformStyle: "preserve-3d",
            }}
            className={cn("absolute inset-0", innerClassName)}
          >
            {children}
          </div>
        </motion.div>
      </div>
    );
  }
);

ParallaxTiltCard.displayName = "ParallaxTiltCard";

export { ParallaxTiltCard };