import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Home from "@/app/page";

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

describe("homepage interactions", () => {
  beforeEach(() => {
    mockMatchMedia(false);
  });

  it("renders the showreel about section with social buttons", () => {
    const { container } = render(<Home />);

    expect(
      screen.getByRole("heading", { name: "About Me" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /YouTube/ })).toHaveAttribute(
      "href",
      "https://youtu.be/pVmaOwbiX9w?si=2sQeQX7UZIs3K1Tt"
    );
    expect(screen.getByRole("link", { name: /Threads/ })).toHaveAttribute(
      "href",
      "https://www.threads.com/@minho_ya_01"
    );
    expect(
      container.querySelector('video[src="/spider/idle_spider.mp4"]')
    ).toBeInTheDocument();
    expect(container.querySelector("canvas")).not.toBeInTheDocument();
    expect(
      container.querySelector('video[src="/ShowReel_SC.mp4"]')
    ).toBeInTheDocument();
  });

  it.each([
    ["Interactive", "/spider/orange_Spider.mp4"],
    ["UX/UI", "/spider/navy_Spider.mp4"],
    ["Motion / 3D", "/spider/green_Spider.mp4"],
  ])(
    "prewarms the spider transition without showing background media on %s hover",
    (buttonName, expectedVideo) => {
      const { container } = render(<Home />);

      fireEvent.mouseEnter(screen.getByRole("button", { name: buttonName }));

      expect(screen.getByRole("button", { name: buttonName })).toHaveAttribute(
        "aria-expanded",
        "true"
      );
      expect(
        container.querySelector(`video[src="${expectedVideo}"]`)
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("background-media-layer").className
      ).toContain("opacity-0");
      expect(container.querySelector('img[alt=""]')).not.toBeInTheDocument();
    }
  );

  it("opens the category panel on click and closes it again", async () => {
    const { container } = render(<Home />);

    const categoryButton = screen.getByRole("button", { name: "UX/UI" });

    fireEvent.mouseEnter(categoryButton);
    fireEvent.pointerDown(categoryButton);
    fireEvent.click(categoryButton);

    expect(screen.queryByText("Selected Category")).not.toBeInTheDocument();
    expect(
      container.querySelector('video[src="/spider/navy_Spider.mp4"]')
    ).toBeInTheDocument();
    expect(container.querySelector('img[alt=""]')).not.toBeInTheDocument();

    const transitionVideo = container.querySelector(
      'video[src="/spider/navy_Spider.mp4"]'
    );

    if (!transitionVideo) {
      throw new Error("Expected desktop spider transition video to render");
    }

    fireEvent.ended(transitionVideo);

    await waitFor(() => {
      expect(screen.getByText("Selected Category")).toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
    expect(
      container.querySelector('video[src="/ShowReel_SC.mp4"]')
    ).toHaveClass("opacity-0");

    const desktopPanel = screen.getByText("Selected Category").closest("section");

    if (!desktopPanel) {
      throw new Error("Expected desktop category panel to render");
    }

    expect(desktopPanel.className).toContain("w-[60%]");
    expect(desktopPanel.className).not.toContain("inset-0");

    await waitFor(() => {
      expect(
        container.querySelector('video[src="/spider/navy_Spider.mp4"]')
      ).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Campus Utility App")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: "Close" })
      ).not.toBeInTheDocument();
    });
  });

  it("re-arms the desktop transition mask before replaying the same spider video", async () => {
    const { container } = render(<Home />);

    const categoryButton = screen.getByRole("button", { name: "UX/UI" });

    fireEvent.mouseEnter(categoryButton);
    fireEvent.click(categoryButton);

    await waitFor(() => {
      expect(screen.getByTestId("transition-mask").className).toContain(
        "opacity-100"
      );
    });

    let transitionVideo = container.querySelector(
      'video[src="/spider/navy_Spider.mp4"]'
    );

    if (!transitionVideo) {
      throw new Error("Expected first desktop spider transition to render");
    }

    fireEvent.loadedData(transitionVideo);

    await waitFor(() => {
      expect(screen.getByTestId("transition-mask").className).toContain(
        "opacity-0"
      );
    });

    fireEvent.ended(transitionVideo);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: "Close" })
      ).not.toBeInTheDocument();
    });

    fireEvent.mouseEnter(categoryButton);
    fireEvent.click(categoryButton);

    await waitFor(() => {
      expect(screen.getByTestId("transition-mask").className).toContain(
        "opacity-100"
      );
    });

    transitionVideo = container.querySelector('video[src="/spider/navy_Spider.mp4"]');

    if (!transitionVideo) {
      throw new Error("Expected repeated desktop spider transition to render");
    }

    fireEvent.loadedData(transitionVideo);

    await waitFor(() => {
      expect(screen.getByTestId("transition-mask").className).toContain(
        "opacity-0"
      );
    });
  });

  it("plays the spider transition on mobile before opening the panel", async () => {
    mockMatchMedia(true);

    const { container } = render(<Home />);

    fireEvent.click(screen.getByRole("button", { name: "Interactive" }));

    expect(screen.queryByText("Selected Category")).not.toBeInTheDocument();
    expect(
      container.querySelector('video[src="/spider/orange_Spider.mp4"]')
    ).toBeInTheDocument();
    expect(container.querySelector("img[alt='']")).not.toBeInTheDocument();
    expect(
      container.querySelector('section[aria-label="Portfolio Hero"]')
    ).toHaveAttribute("aria-hidden", "true");

    const transitionVideo = container.querySelector(
      'video[src="/spider/orange_Spider.mp4"]'
    );

    if (!transitionVideo) {
      throw new Error("Expected mobile transition video to render");
    }

    fireEvent.ended(transitionVideo);

    await waitFor(() => {
      expect(
        screen.getByText("Selected Category")
      ).toBeInTheDocument();
    });

    const mobilePanel = screen.getByText("Selected Category").closest("section");

    if (!mobilePanel) {
      throw new Error("Expected mobile category panel to render");
    }

    expect(mobilePanel.className).toContain("inset-0");
    expect(mobilePanel.className).toContain("rounded-none");
    expect(mobilePanel.className).not.toContain("w-[60%]");

    await waitFor(() => {
      expect(
        container.querySelector('video[src="/spider/orange_Spider.mp4"]')
      ).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Dog Follow Prototype")).toBeInTheDocument();
    });
  });

  it("eagerly preloads spider videos on touch layout before selection", async () => {
    mockMatchMedia(true);

    render(<Home />);

    await waitFor(() => {
      expect(
        (HTMLMediaElement.prototype.load as unknown as { mock: { calls: unknown[] } }).mock.calls.length
      ).toBeGreaterThanOrEqual(4);
    });
  });
});