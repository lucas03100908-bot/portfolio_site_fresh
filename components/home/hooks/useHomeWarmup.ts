"use client";

import { useEffect } from "react";
import { useAssetPreloader } from "@/hooks/use-asset-preloader";

export function useHomeWarmup(layoutResolved: boolean) {
  const { warmPanelChunk } = useAssetPreloader();

  useEffect(() => {
    if (!layoutResolved || typeof window === "undefined") {
      return;
    }

    const browserWindow = window;
    let frameId = 0;
    let idleId: number | null = null;

    const warmPanelContent = () => {
      warmPanelChunk();
    };

    if (typeof browserWindow.requestIdleCallback === "function") {
      idleId = browserWindow.requestIdleCallback(warmPanelContent, {
        timeout: 900,
      });
    } else {
      frameId = requestAnimationFrame(() => {
        frameId = requestAnimationFrame(warmPanelContent);
      });
    }

    return () => {
      if (idleId !== null) {
        browserWindow.cancelIdleCallback?.(idleId);
      }
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [layoutResolved, warmPanelChunk]);

  return { warmPanelChunk };
}
