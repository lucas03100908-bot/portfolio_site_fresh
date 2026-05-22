"use client";

import { ProjectItem } from "@/lib/types";

interface ProjectCardInfoProps {
  project: ProjectItem;
  isSelected: boolean;
}

export function ProjectCardInfo({ project, isSelected }: ProjectCardInfoProps) {
  return (
    <div className="flex flex-1 flex-col">
      <h3 className="mt-4 text-lg font-semibold leading-[1.3] text-white/94 group-hover:text-white md:mt-5 md:text-[20px]">
        {project.title}
      </h3>

      <p className="mt-1 text-[13px] font-medium tracking-wide text-white/40 uppercase group-hover:text-white/56">
        {project.subtitle}
      </p>

      <p className="mt-3 line-clamp-3 text-[13px] leading-relaxed text-white/60 group-hover:text-white/72 md:mt-4 md:text-[14px] md:leading-normal">
        {project.description}
      </p>

      {project.tools && project.tools.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-1.5 md:mt-5">
          {project.tools.map((tool) => (
            <span
              key={tool}
              className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium text-white/50 group-hover:border-white/14 group-hover:bg-white/[0.08] group-hover:text-white/62"
            >
              {tool}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-5 flex items-center gap-2 text-[13px] font-semibold text-white/72 transition-colors group-hover:text-white">
        <span>{isSelected ? "Reading Full Caption" : "Read Full Caption"}</span>
        <svg
          className={`h-3.5 w-3.5 transition-transform ${isSelected ? "translate-x-1" : "group-hover:translate-x-1"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      </div>
    </div>
  );
}
