import React from "react";

import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeAll, vi } from "vitest";

vi.mock("next/image", () => ({
  default: ({ src, alt, fill, priority, ...props }: Record<string, unknown>) => {
    void fill;
    void priority;

    const resolvedSrc =
      typeof src === "string"
        ? src
        : typeof src === "object" && src !== null && "src" in src
          ? String(src.src)
          : "";

    return React.createElement("img", {
      ...props,
      src: resolvedSrc,
      alt,
    });
  },
}));

vi.mock("next/dynamic", () => {
  return {
    default: (loader: () => Promise<{ default: React.ComponentType<Record<string, unknown>> }>) => {
      const DynamicComponent = (props: Record<string, unknown>) => {
        const [Component, setComponent] = React.useState<React.ComponentType<Record<string, unknown>> | null>(null);

        React.useEffect(() => {
          loader().then((mod) => {
            setComponent(() => mod.default);
          });
        }, []);

        if (!Component) return null;
        return React.createElement(Component, props);
      };
      DynamicComponent.displayName = "MockDynamicComponent";
      return DynamicComponent;
    },
  };
});

vi.mock("@/components/ui/spider-thermal-effect", () => ({
  SpiderThermalEffect: () =>
    React.createElement("div", {
      "data-testid": "spider-thermal-effect",
    }),
}));

beforeAll(() => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  );

  vi.stubGlobal(
    "requestIdleCallback",
    ((callback: IdleRequestCallback) =>
      window.setTimeout(
        () => callback({ didTimeout: false, timeRemaining: () => 50 } as IdleDeadline),
        0
      )) as typeof requestIdleCallback
  );

  vi.stubGlobal(
    "cancelIdleCallback",
    ((id: number) => window.clearTimeout(id)) as typeof cancelIdleCallback
  );

  vi.stubGlobal(
    "IntersectionObserver",
    class MockIntersectionObserver implements IntersectionObserver {
      private callback: IntersectionObserverCallback;

      readonly root = null;
      readonly rootMargin = "0px";
      readonly thresholds = [0];

      constructor(callback: IntersectionObserverCallback) {
        this.callback = callback;
      }

      disconnect() {}
      observe(target: Element) {
        const isProfileSection = target instanceof HTMLElement && target.id === "about";
        const rect = target.getBoundingClientRect();

        this.callback(
          [
            {
              boundingClientRect: rect,
              intersectionRatio: isProfileSection ? 0 : 1,
              intersectionRect: rect,
              isIntersecting: !isProfileSection,
              rootBounds: null,
              target,
              time: Date.now(),
            },
          ],
          this
        );
      }
      takeRecords() {
        return [];
      }
      unobserve() {}
    }
  );

  Object.defineProperty(HTMLMediaElement.prototype, "play", {
    configurable: true,
    writable: true,
    value: vi.fn().mockResolvedValue(undefined),
  });

  Object.defineProperty(HTMLMediaElement.prototype, "load", {
    configurable: true,
    writable: true,
    value: vi.fn(),
  });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});