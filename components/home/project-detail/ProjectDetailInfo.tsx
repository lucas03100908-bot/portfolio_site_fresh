"use client";

import { ProjectItem } from "@/lib/types";

interface ProjectDetailInfoProps {
  project: ProjectItem;
}

export function ProjectDetailInfo({ project }: ProjectDetailInfoProps) {
  return (
    <div className="mt-6 md:mt-7">
      <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/34">
        Full Caption
      </p>
      <h4 className="mt-3 text-[26px] font-semibold leading-[1.08] tracking-[-0.05em] text-white md:text-[32px]">
        {project.title}
      </h4>
      <p className="mt-3 text-[13px] font-medium uppercase tracking-[0.14em] text-white/48 md:text-[14px]">
        {project.subtitle}
      </p>
      <p className="mt-5 whitespace-pre-line text-[14px] leading-[1.85] text-white/74 md:text-[15px] md:leading-[1.9]">
        {project.description}
      </p>

      {project.tools && project.tools.length > 0 ? (
        <div className="mt-6 flex flex-wrap gap-2">
          {project.tools.map((tool) => (
            <span
              key={tool}
              className="rounded-full border border-white/12 bg-white/[0.06] px-3 py-1 text-[11px] font-medium text-white/62"
            >
              {tool}
            </span>
          ))}
        </div>
      ) : null}

      {project.externalLink ? (
        <div className="mt-7 flex flex-wrap items-center gap-3 md:mt-8">
          <a
            href={project.externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/[0.08] px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-white/24 hover:bg-white/[0.12]"
          >
            <span>{project.linkLabel || "View Project"}</span>
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.25}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>
        </div>
      ) : null}
    </div>
  );
}
