import { CategoryInfo, CategoryKey } from "@/lib/types";

import interactive from "./interactive";
import motion from "./motion";
import planning from "./planning";
import uxui from "./uxui";

export const categories: CategoryInfo[] = [interactive, uxui, motion, planning];

export const categoryMap = Object.fromEntries(
  categories.map((category) => [category.key, category])
) as Record<CategoryKey, CategoryInfo>;