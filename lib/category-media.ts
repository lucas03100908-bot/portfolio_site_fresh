import { CategoryInfo } from "./types";

interface BackgroundMediaOptions {
  panelOpen?: boolean;
  useTransitionVideo?: boolean;
  suppressWhenPanelOpen?: boolean;
}

function filterExistingSources(sources: Array<string | undefined | null>) {
  return sources.filter((src): src is string => Boolean(src));
}

export function getCategoryBackgroundVideo(
  category: CategoryInfo | null,
  options: BackgroundMediaOptions = {}
) {
  const {
    panelOpen = false,
    useTransitionVideo = false,
    suppressWhenPanelOpen = true,
  } = options;

  if (!category || (panelOpen && suppressWhenPanelOpen)) {
    return null;
  }

  if (useTransitionVideo) {
    return category.transitionVideo ?? category.hoverVideo ?? null;
  }

  return category.hoverVideo ?? category.transitionVideo ?? null;
}

export function getCategoryPreviewImage(category: CategoryInfo | null) {
  return (
    category?.preview.find((item) => item.startsWith("/")) ??
    category?.projects.find((project) => project.thumbnail)?.thumbnail ??
    null
  );
}

export function getCategoryBackgroundImage(
  category: CategoryInfo | null,
  options: BackgroundMediaOptions = {}
) {
  const { panelOpen = false } = options;

  if (!category || panelOpen) {
    return null;
  }

  return getCategoryPreviewImage(category);
}

export function getCategoryBackgroundImageSources(category: CategoryInfo) {
  return filterExistingSources([getCategoryPreviewImage(category)]);
}
