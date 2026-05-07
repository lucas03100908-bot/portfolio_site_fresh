"use client";

import Image from "next/image";
import { memo, useEffect, useRef, useState } from "react";

import { ProjectItem } from "@/lib/types";

interface CategoryProjectCardProps {
  project: ProjectItem;
  accentColor: string;
  accentMid: string;
}

function LazyVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const hasLoadedRef = useRef(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "160px 0px", threshold: 0.05 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

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
      ref={ref}
      className="h-full w-full object-cover"
      muted
      loop
      playsInline
      preload="metadata"
    />
  );
}

function CategoryProjectCard({
  project,
  accentColor,
  accentMid,
}: CategoryProjectCardProps) {
  const cardStyle = {
    contentVisibility: "auto" as const,
    containIntrinsicSize: "320px",
  };

  const content = (
    <div
      className="group relative h-full overflow-hidden rounded-[22px] border border-white/8 bg-white/[0.04] p-3 transition-[transform,border-color] duration-300 transform-gpu motion-safe:hover:-translate-y-1 motion-safe:hover:border-white/18 md:rounded-[26px] md:p-4"
      style={cardStyle}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.025)_56%,rgba(255,255,255,0)_100%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative z-10 flex h-full flex-col">
        <div className="relative h-40 overflow-hidden rounded-[16px] bg-black/20 sm:h-44 md:h-48 md:rounded-[20px]">
          {project.video ? (
            <LazyVideo src={project.video} />
          ) : project.thumbnail ? (
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
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

          {project.externalLink ? (
            <div className="mt-5 flex items-center gap-2 text-[13px] font-semibold text-white/72 transition-colors group-hover:text-white">
              <span>{project.linkLabel || "View Project"}</span>
              <svg
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
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
          ) : null}
        </div>
      </div>
    </div>
  );

  if (project.externalLink) {
    return (
      <a
        href={project.externalLink}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full outline-none"
      >
        {content}
      </a>
    );
  }

  return <div className="h-full">{content}</div>;
}

export default memo(CategoryProjectCard);