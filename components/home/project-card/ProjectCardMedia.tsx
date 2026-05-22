"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { ProjectItem } from "@/lib/types";

interface ProjectCardMediaProps {
  project: ProjectItem;
  accentColor: string;
  accentMid: string;
  priority: boolean;
}

function LazyVideo({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasLoadedRef = useRef(false);
  const { nodeRef, isIntersecting: visible } = useIntersectionObserver({
    rootMargin: "160px 0px",
    threshold: 0.05,
  });

  useEffect(() => {
    const element = videoRef.current;
    if (!element) return;

    if (visible) {
      if (!hasLoadedRef.current) {
        element.src = src;
        element.load();
        hasLoadedRef.current = true;
      }
      element.play().catch(() => {});
      return;
    }
    element.pause();
  }, [visible, src]);

  return (
    <video
      ref={(node) => {
        videoRef.current = node;
        nodeRef.current = node;
      }}
      className="h-full w-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
    />
  );
}

export function ProjectCardMedia({
  project,
  accentColor,
  accentMid,
  priority,
}: ProjectCardMediaProps) {
  return (
    <div className="relative h-40 overflow-hidden rounded-[16px] bg-black/20 transform-gpu [backface-visibility:hidden] sm:h-44 md:h-48 md:rounded-[20px]">
      {project.video ? (
        <LazyVideo src={project.video} />
      ) : project.thumbnail ? (
        <Image
          src={project.thumbnail}
          alt={project.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          priority={priority}
          loading={priority ? undefined : "lazy"}
        />
      ) : (
        <div
          className="h-full w-full"
          style={{
            background: `radial-gradient(circle at 30% 20%, ${accentMid}88, transparent 38%), radial-gradient(circle at 70% 65%, ${accentColor}55, transparent 42%), linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.03))`,
          }}
        />
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
}
