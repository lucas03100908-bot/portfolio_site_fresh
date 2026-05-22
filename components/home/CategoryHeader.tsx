"use client";

import Image from "next/image";
import { CategoryInfo } from "@/lib/types";
import { getCategoryPreviewImage } from "@/lib/category-media";

interface CategoryHeaderProps {
  category: CategoryInfo;
}

export function CategoryHeader({ category }: CategoryHeaderProps) {
  const previewImage = getCategoryPreviewImage(category);

  return (
    <div className="relative mt-4 overflow-hidden rounded-[20px] border border-white/10 bg-black/30 md:mt-5 md:rounded-[28px]">
      <div className="relative h-60 sm:h-72 md:h-[360px]">
        {previewImage ? (
          <Image
            src={previewImage}
            alt={category.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 60vw"
            priority
          />
        ) : (
          <div
            className="h-full w-full"
            style={{
              background: `radial-gradient(circle at 24% 24%, ${category.mid}66 0%, transparent 28%), radial-gradient(circle at 76% 30%, ${category.color}55 0%, transparent 32%), linear-gradient(135deg, rgba(255,255,255,0.16), rgba(255,255,255,0.02))`,
            }}
          />
        )}

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,8,14,0.1)_0%,rgba(4,8,14,0.35)_50%,rgba(10,15,24,0.98)_100%)]" />

        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 md:p-8">
          <p className="text-[10px] uppercase tracking-[0.32em] text-white/45 md:text-xs">
            Category
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl md:mt-3 md:text-4xl">
            {category.name}
          </h2>
          <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-white/75 sm:text-sm md:mt-4 md:text-base md:leading-7">
            {category.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-2 md:mt-6">
            {category.preview.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white/60 backdrop-blur-md"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
