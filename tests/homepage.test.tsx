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

function setScrollY(scrollY: number) {
  Object.defineProperty(window, "scrollY", {
    configurable: true,
    writable: true,
    value: scrollY,
  });
}

describe("homepage interactions", () => {
  beforeEach(() => {
    mockMatchMedia(false);
    window.scrollTo = vi.fn();
    setScrollY(0);
  });

  it("renders the final section with one accessible set of social links", async () => {
    const { container } = render(<Home />);

    expect(await screen.findByRole("heading", { name: "Moments people can feel." })).toBeInTheDocument();
    expect(await screen.findByRole("link", { name: "Instagram" })).toHaveAttribute(
      "href",
      "https://www.instagram.com/mho.xxv/"
    );
    expect(screen.getByRole("link", { name: "Threads" })).toHaveAttribute(
      "href",
      "https://www.threads.net/@mho.xxv"
    );
    expect(screen.getByRole("link", { name: "YouTube" })).toHaveAttribute(
      "href",
      "https://youtube.com/channel/UCzvEbjghgfUZaj2v-uLIVjw?si=vvMZktWc3uFfq0Ug"
    );
    expect(screen.getAllByRole("link")).toHaveLength(3);
    expect(
      container.querySelector('video[src="/spider/idle_spider.mp4"]')
    ).toBeInTheDocument();
    
    await waitFor(() => {
      expect(
        container.querySelector('video[src="/ShowReel_SC.mp4"]')
      ).toBeInTheDocument();
    });
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

    const transitionVideo = container.querySelector(
      'video[src="/spider/navy_Spider.mp4"]'
    );

    if (!transitionVideo) {
      throw new Error("Expected desktop transition video to render");
    }

    expect(screen.queryByText("Selected Category")).not.toBeInTheDocument();

    fireEvent.ended(transitionVideo);

    await waitFor(() => {
      expect(screen.getByText("Selected Category")).toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();

    await waitFor(() => {
      expect(
        container.querySelector('video[src="/spider/navy_Spider.mp4"]')
      ).not.toBeInTheDocument();
    });

    // Showreel video might be null if suspendMedia is true in dynamic ShowreelSection
    await waitFor(() => {
      const showreelVideo = container.querySelector('video[src="/ShowReel_SC.mp4"]');
      if (showreelVideo) {
        expect(showreelVideo).toHaveClass("opacity-0");
      }
    });

    const desktopPanel = screen.getByText("Selected Category").closest("section");

    if (!desktopPanel) {
      throw new Error("Expected desktop category panel to render");
    }

    expect(desktopPanel.className).toContain("fixed");
    expect(desktopPanel.className).toContain("inset-y-0");
    expect(desktopPanel.className).not.toContain("inset-0");

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

  it("opens a project detail panel from the category grid and keeps the link inside that panel", async () => {
    const { container } = render(<Home />);

    const categoryButton = screen.getByRole("button", { name: "UX/UI" });

    fireEvent.mouseEnter(categoryButton);
    fireEvent.pointerDown(categoryButton);
    fireEvent.click(categoryButton);

    const transitionVideo = container.querySelector(
      'video[src="/spider/navy_Spider.mp4"]'
    );

    if (!transitionVideo) {
      throw new Error("Expected desktop transition video to render");
    }

    fireEvent.ended(transitionVideo);

    await waitFor(() => {
      expect(screen.getByText("Campus Utility App")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Campus Utility App/i }));

    const detailPanel = screen.getByRole("dialog", { name: /Campus Utility App details/i });

    expect(detailPanel).toBeInTheDocument();
    expect(detailPanel).toHaveAttribute("data-detail-layout", "full-panel");
    expect(screen.getByText("Project Detail")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Pixafe/i })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View Project" })).toHaveAttribute(
      "href",
      "https://www.instagram.com/p/DNa0bJwyaIs/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
    );

    fireEvent.click(screen.getByRole("button", { name: "Back" }));

    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: /Campus Utility App details/i })
      ).not.toBeInTheDocument();
    });
  });

  it("opens project detail as a bottom sheet on touch layout", async () => {
    mockMatchMedia(true);

    const { container } = render(<Home />);

    fireEvent.click(screen.getByRole("button", { name: "Interactive" }));

    const transitionVideo = container.querySelector(
      'video[src="/spider/orange_Spider.mp4"]'
    );

    if (!transitionVideo) {
      throw new Error("Expected mobile transition video to render");
    }

    fireEvent.ended(transitionVideo);

    await waitFor(() => {
      expect(screen.getByText("Dog Follow Prototype")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Dog Follow Prototype/i }));

    const detailPanel = screen.getByRole("dialog", { name: /Dog Follow Prototype details/i });

    expect(detailPanel).toBeInTheDocument();
    expect(detailPanel).toHaveAttribute("data-detail-layout", "bottom-sheet");

    fireEvent.click(screen.getByRole("button", { name: "Back" }));

    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: /Dog Follow Prototype details/i })
      ).not.toBeInTheDocument();
    });
  });

  it("returns to the top state when Escape is pressed", async () => {
    const { container } = render(<Home />);

    fireEvent.mouseEnter(screen.getByRole("button", { name: "UX/UI" }));

    expect(
      container.querySelector('video[src="/spider/navy_Spider.mp4"]')
    ).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Escape" });

    await waitFor(() => {
      expect(
        container.querySelector('video[src="/spider/navy_Spider.mp4"]')
      ).not.toBeInTheDocument();
    });

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("returns to the top state when the name is clicked", async () => {
    render(<Home />);

    fireEvent.mouseEnter(screen.getByRole("button", { name: "Motion / 3D" }));
    fireEvent.click(screen.getByRole("button", { name: "Kim Minho" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Motion / 3D" })).toHaveAttribute(
        "aria-expanded",
        "false"
      );
    });

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("closes the desktop category panel when the backdrop is clicked", async () => {
    const { container } = render(<Home />);

    const categoryButton = screen.getByRole("button", { name: "Interactive" });

    fireEvent.mouseEnter(categoryButton);
    fireEvent.click(categoryButton);

    const transitionVideo = container.querySelector(
      'video[src="/spider/orange_Spider.mp4"]'
    );

    if (!transitionVideo) {
      throw new Error("Expected desktop transition video to render");
    }

    fireEvent.ended(transitionVideo);

    await waitFor(() => {
      expect(screen.getByText("Selected Category")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Close category panel" }));

    await waitFor(() => {
      expect(screen.queryByText("Selected Category")).not.toBeInTheDocument();
    });
  });

  it("plays the desktop spider transition before opening the panel", async () => {
    const { container } = render(<Home />);

    const categoryButton = screen.getByRole("button", { name: "UX/UI" });

    fireEvent.mouseEnter(categoryButton);
    fireEvent.click(categoryButton);

    const transitionVideo = container.querySelector(
      'video[src="/spider/navy_Spider.mp4"]'
    );

    if (!transitionVideo) {
      throw new Error("Expected desktop transition video to render");
    }

    expect(screen.queryByText("Selected Category")).not.toBeInTheDocument();
    fireEvent.ended(transitionVideo);

    await waitFor(() => {
      expect(screen.getByText("Selected Category")).toBeInTheDocument();
      expect(screen.getByTestId("transition-mask").className).toContain("opacity-0");
      expect(
        container.querySelector('video[src="/spider/navy_Spider.mp4"]')
      ).not.toBeInTheDocument();
    });
  });

  it("opens the desktop category panel immediately after scrolling past the hero", () => {
    setScrollY(window.innerHeight);

    const { container } = render(<Home />);

    fireEvent.click(screen.getByRole("button", { name: "UX/UI" }));

    const panel = screen.getByText("Selected Category").closest("section");

    expect(panel).not.toBeNull();
    expect(panel).toHaveAttribute("aria-busy", "false");
    expect(
      container.querySelector('video[src="/spider/navy_Spider.mp4"]')
    ).not.toBeInTheDocument();
  });

  it("opens the desktop category panel immediately from the final links section", () => {
    setScrollY(window.innerHeight * 2);

    const { container } = render(<Home />);

    fireEvent.click(screen.getByRole("button", { name: "UX/UI" }));

    const panel = screen.getByText("Selected Category").closest("section");

    expect(panel).not.toBeNull();
    expect(panel).toHaveAttribute("aria-busy", "false");
    expect(
      container.querySelector('video[src="/spider/navy_Spider.mp4"]')
    ).not.toBeInTheDocument();
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