import { describe, expect, it } from "vitest";

import { categoryMap } from "@/lib/categories";
import {
  getCategoryBackgroundVideo,
  getCategoryPreviewImage,
} from "@/lib/category-media";
import { CategoryKey } from "@/lib/types";

describe("category media selection", () => {
  it.each([
    ["interactive", "/spider/orange_Spider.mp4"],
    ["uxui", "/spider/navy_Spider.mp4"],
    ["motion", "/spider/green_Spider.mp4"],
  ])(
    "can prefer the spider transition video for %s previews",
    (categoryKey, expectedVideo) => {
      expect(
        getCategoryBackgroundVideo(categoryMap[categoryKey as CategoryKey], {
          suppressWhenPanelOpen: false,
          useTransitionVideo: true,
        })
      ).toBe(expectedVideo);
    }
  );

  it("uses spider transition media for mobile panel entry and suppresses it when the panel opens", () => {
    expect(
      getCategoryBackgroundVideo(categoryMap.interactive, {
        panelOpen: false,
        useTransitionVideo: true,
      })
    ).toBe("/spider/orange_Spider.mp4");

    expect(getCategoryPreviewImage(categoryMap.interactive)).toBe("https://img.youtube.com/vi/3htRZNJ78uM/maxresdefault.jpg");

    expect(
      getCategoryBackgroundVideo(categoryMap.interactive, {
        panelOpen: true,
        useTransitionVideo: true,
      })
    ).toBeNull();
  });

  it("uses the curated hover image when mobile categories do not have a hover video", () => {
    expect(getCategoryPreviewImage(categoryMap.planning)).toBe("/najeonS.webp");
  });
});