"use client";

import { useCallback, useRef } from "react";
import { categoryMap } from "@/lib/categories";
import { getCategoryBackgroundImageSources } from "@/lib/category-media";
import { CategoryKey } from "@/lib/types";
import { loadCategoryPanelContent } from "@/components/home/loadCategoryPanelContent";

export type VideoPreloadMode = "metadata" | "auto";

export interface WarmCategoryBackgroundOptions {
  hoverVideoMode?: VideoPreloadMode | null;
  preloadPreviewImage?: boolean;
  transitionVideoMode?: VideoPreloadMode | null;
}

/**
 * Hook to manage asset preloading for categories.
 */
export function useAssetPreloader() {
  const warmedBackgroundImagesRef = useRef<Set<CategoryKey>>(new Set());
  const panelChunkWarmedRef = useRef(false);
  const preloadedVideosRef = useRef<
    Map<string, { element: HTMLVideoElement; mode: VideoPreloadMode }>
  >(new Map());

  const warmPanelChunk = useCallback(() => {
    if (panelChunkWarmedRef.current) {
      return;
    }

    panelChunkWarmedRef.current = true;
    void loadCategoryPanelContent();
  }, []);

  const preloadImage = useCallback((src: string) => {
    if (typeof window === "undefined") return;
    const image = new window.Image();
    image.decoding = "async";
    image.src = src;
  }, []);

  const preloadVideo = useCallback((src: string, mode: VideoPreloadMode) => {
    if (typeof document === "undefined") return;
    
    const existingVideo = preloadedVideosRef.current.get(src);

    if (!existingVideo) {
      const preloadVideoElement = document.createElement("video");
      preloadVideoElement.preload = mode;
      preloadVideoElement.muted = true;
      preloadVideoElement.defaultMuted = true;
      preloadVideoElement.playsInline = true;
      preloadVideoElement.src = src;
      preloadVideoElement.load();

      preloadedVideosRef.current.set(src, {
        element: preloadVideoElement,
        mode,
      });

      return;
    }

    if (existingVideo.mode === "auto" || existingVideo.mode === mode) {
      return;
    }

    existingVideo.mode = mode;
    existingVideo.element.preload = mode;
    existingVideo.element.load();
  }, []);

  const warmCategoryBackgroundAssets = useCallback(
    (
      category: CategoryKey,
      {
        hoverVideoMode = "metadata",
        preloadPreviewImage = true,
        transitionVideoMode = "metadata",
      }: WarmCategoryBackgroundOptions = {}
    ) => {
      if (typeof window === "undefined") {
        return;
      }

      const data = categoryMap[category];

      if (preloadPreviewImage && !warmedBackgroundImagesRef.current.has(category)) {
        warmedBackgroundImagesRef.current.add(category);
        getCategoryBackgroundImageSources(data).forEach(preloadImage);
      }

      if (transitionVideoMode && data.transitionVideo) {
        preloadVideo(data.transitionVideo, transitionVideoMode);
      }

      if (hoverVideoMode && data.hoverVideo) {
        preloadVideo(data.hoverVideo, hoverVideoMode);
      }
    },
    [preloadImage, preloadVideo]
  );

  return {
    warmPanelChunk,
    warmCategoryBackgroundAssets,
    preloadImage,
    preloadVideo,
  };
}
