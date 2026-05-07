"use client";

import Image from "next/image";

import CategoryProjectCard from "@/components/home/CategoryProjectCard";
import { getCategoryPreviewImage } from "@/lib/category-media";
import { CategoryInfo } from "@/lib/types";

interface CategoryPanelContentProps {
  category: CategoryInfo;
}

export default function CategoryPanelContent({
  category,
}: CategoryPanelContentProps) {
  const previewImage = getCategoryPreviewImage(category);

  return (
    <>
      <div className="relative mt-4 overflow-hidden rounded-[20px] border border-white/10 bg-black/30 md:mt-5 md:rounded-[28px]">
        <div className="relative h-52 sm:h-64 md:h-[320px]">
          {previewImage ? (
            <Image
              src={previewImage}
              alt={category.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 60vw"
              loading="eager"
            />
          ) : (
            <div
              className="h-full w-full"
              style={{
                background: `radial-gradient(circle at 24% 24%, ${category.mid}66 0%, transparent 28%), radial-gradient(circle at 76% 30%, ${category.color}55 0%, transparent 32%), linear-gradient(135deg, rgba(255,255,255,0.16), rgba(255,255,255,0.02))`,
              }}
            />
          )}

          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,8,14,0.12)_0%,rgba(4,8,14,0.3)_45%,rgba(10,15,24,0.96)_100%)]" />

          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 md:p-7">
            <p className="text-xs uppercase tracking-[0.3em] text-white/45">
              Category
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl md:mt-3 md:text-4xl">
              {category.name}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/72 md:mt-4 md:text-base md:leading-7">
              {category.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-2 md:mt-5">
              {category.preview.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/12 bg-black/30 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/72"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:mt-8 md:gap-5 xl:grid-cols-3 [content-visibility:auto] [contain-intrinsic-size:1px_960px]">
        {category.projects.map((project) => (
          <CategoryProjectCard
            key={project.title}
            project={project}
            accentColor={category.color}
            accentMid={category.mid}
          />
        ))}
      </div>
    </>
  );
}