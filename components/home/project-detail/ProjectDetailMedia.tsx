"use client";

import Image from "next/image";
import { ProjectItem } from "@/lib/types";

interface ProjectDetailMediaProps {
  project: ProjectItem;
  accentColor: string;
  accentMid: string;
}

export function ProjectDetailMedia({
  project,
  accentColor,
  accentMid,
}: ProjectDetailMediaProps) {
  return (
    <div className="relative h-48 overflow-hidden rounded-[24px] border border-white/10 bg-black/30 md:h-56">
      {project.video ? (
        <video
          src={project.video}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
        />
      ) : project.thumbnail ? (
        <Image
          src={project.thumbnail}
          alt={project.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 60vw"
        />
      ) : (
        <div
          className="h-full w-full"
          style={{
            background: `radial-gradient(circle at 22% 22%, ${accentMid}88, transparent 34%), radial-gradient(circle at 78% 70%, ${accentColor}66, transparent 40%), linear-gradient(135deg, rgba(255,255,255,0.16), rgba(255,255,255,0.03))`,
          }}
        />
      )}

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,11,0.06)_0%,rgba(5,7,11,0.18)_42%,rgba(5,7,11,0.54)_100%)]" />
    </div>
  );
}
