"use client";

import CategoryProjectCard from "@/components/home/CategoryProjectCard";
import { CategoryInfo, ProjectItem } from "@/lib/types";

interface CategoryProjectGridProps {
  category: CategoryInfo;
  selectedProjectTitle?: string | null;
  onProjectSelect: (project: ProjectItem) => void;
}

export function CategoryProjectGrid({
  category,
  selectedProjectTitle = null,
  onProjectSelect,
}: CategoryProjectGridProps) {
  return (
    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:mt-8 md:gap-5 xl:grid-cols-3 [content-visibility:auto] [contain-intrinsic-size:1px_960px]">
      {category.projects.map((project, index) => (
        <CategoryProjectCard
          key={project.title}
          project={project}
          accentColor={category.color}
          accentMid={category.mid}
          isSelected={selectedProjectTitle === project.title}
          priority={index < 3}
          onSelect={onProjectSelect}
        />
      ))}
    </div>
  );
}
