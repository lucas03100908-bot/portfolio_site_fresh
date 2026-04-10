import Image from "next/image";
import { memo } from "react";
import { ProjectItem } from "@/lib/types";

interface ProjectMediaCardProps {
  project: ProjectItem;
  accentColor: string;
  accentMid: string;
}

function ProjectMediaCard({
  project,
  accentColor,
  accentMid,
}: ProjectMediaCardProps) {
  const CardContent = (
    <div className="group relative h-full rounded-[22px] border border-white/8 bg-white/[0.04] p-3 transition-all duration-300 hover:bg-white/[0.08] hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] md:rounded-[26px] md:p-4 will-change-transform">
      {/* Media Section */}
      <div className="relative h-40 overflow-hidden rounded-[16px] bg-black/20 sm:h-44 md:h-48 md:rounded-[20px] will-change-transform">
        {project.video ? (
          <video
            src={project.video}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 will-change-transform"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : project.thumbnail ? (
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105 will-change-transform"
          />
        ) : (
          <div
            className="h-full w-full transition-transform duration-500 group-hover:scale-105 will-change-transform"
            style={{
              background: `radial-gradient(circle at 30% 20%, ${accentMid}88, transparent 38%), radial-gradient(circle at 70% 65%, ${accentColor}55, transparent 42%), linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.03))`,
            }}
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 will-change-opacity" />
      </div>

      {/* Content Section */}
      <div className="flex flex-col">
        <h3 className="mt-4 text-lg font-semibold leading-[1.3] text-white md:mt-5 md:text-[20px]">
          {project.title}
        </h3>

        <p className="mt-1 text-[13px] font-medium tracking-wide text-white/40 uppercase">
          {project.subtitle}
        </p>

        <p className="mt-3 line-clamp-3 text-[13px] leading-relaxed text-white/60 md:mt-4 md:text-[14px] md:leading-normal">
          {project.description}
        </p>

        {project.tools && project.tools.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5 md:mt-5">
            {project.tools.map((tool) => (
              <span
                key={tool}
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium text-white/50 backdrop-blur-sm"
              >
                {tool}
              </span>
            ))}
          </div>
        )}
        
        {project.externalLink && (
          <div className="mt-5 flex items-center gap-2 text-[13px] font-semibold text-white/80 transition-colors group-hover:text-white">
            <span>{project.linkLabel || "View Project"}</span>
            <svg 
              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );

  if (project.externalLink) {
    return (
      <a
        href={project.externalLink}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full outline-none transition-transform hover:scale-[1.01] active:scale-[0.99] will-change-transform"
      >
        {CardContent}
      </a>
    );
  }

  return <div className="h-full">{CardContent}</div>;
}

export default memo(ProjectMediaCard);
