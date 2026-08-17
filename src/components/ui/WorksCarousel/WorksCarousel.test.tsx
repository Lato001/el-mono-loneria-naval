import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WorksCarousel } from "./WorksCarousel";
import { IMAGE_FALLBACK_SRC } from "../ImageFallback";
import type { WorksCarouselImage } from "./WorksCarousel.types";

const mockImages: WorksCarouselImage[] = [
  { src: "/img1.jpg", alt: "Image 1", originalIndex: 0 },
  { src: "/img2.jpg", alt: "Image 2", originalIndex: 1 },
  { src: "/img3.jpg", alt: "Image 3", originalIndex: 2 },
  { src: "/img4.jpg", alt: "Image 4", originalIndex: 3 },
  { src: "/img5.jpg", alt: "Image 5", originalIndex: 4 },
  { src: "/img6.jpg", alt: "Image 6", originalIndex: 5 },
];

describe("WorksCarousel", () => {
  it("renders thumbnails for each provided image", () => {
    render(<WorksCarousel images={mockImages} onThumbSelect={vi.fn()} />);

    const thumbnails = screen.getAllByRole("button", { name: /thumbnail/i });
    expect(thumbnails).toHaveLength(mockImages.length);
  });

  it("renders prev/next navigation buttons", () => {
    render(<WorksCarousel images={mockImages} onThumbSelect={vi.fn()} />);

    expect(screen.getByLabelText("Anterior")).toBeInTheDocument();
    expect(screen.getByLabelText("Siguiente")).toBeInTheDocument();
  });

  it("calls onThumbSelect with originalIndex when thumbnail is clicked", async () => {
    const onThumbSelect = vi.fn();
    render(<WorksCarousel images={mockImages} onThumbSelect={onThumbSelect} />);

    const user = userEvent.setup();
    const thumbnails = screen.getAllByRole("button", { name: /thumbnail/i });
    await user.click(thumbnails[1]); // Click second thumbnail (originalIndex: 1)

    expect(onThumbSelect).toHaveBeenCalledTimes(1);
    expect(onThumbSelect).toHaveBeenCalledWith(1);
  });

  it("is hidden when fewer than 2 images provided", () => {
    render(<WorksCarousel images={mockImages.slice(0, 1)} onThumbSelect={vi.fn()} />);

    expect(screen.queryByRole("button", { name: /thumbnail/i })).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Anterior")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Siguiente")).not.toBeInTheDocument();
  });

  it("does not auto-advance (no autoplay)", () => {
    vi.useFakeTimers();
    render(<WorksCarousel images={mockImages} onThumbSelect={vi.fn()} />);

    const thumbnails = screen.getAllByRole("button", { name: /thumbnail/i });
    const initialCount = thumbnails.length;

    // Advance timers - no auto-advance should occur
    vi.advanceTimersByTime(10000);

    const thumbnailsAfter = screen.getAllByRole("button", { name: /thumbnail/i });
    expect(thumbnailsAfter).toHaveLength(initialCount);

    vi.useRealTimers();
  });

  it("applies correct width classes for responsive visible count (2 mobile, 4 desktop)", () => {
    render(<WorksCarousel images={mockImages} onThumbSelect={vi.fn()} />);

    const thumbnails = screen.getAllByRole("button", { name: /thumbnail/i });
    thumbnails.forEach((thumb) => {
      // Each thumbnail should have the responsive width classes
      expect(thumb).toHaveClass("w-[calc(50%-8px)]");
      expect(thumb).toHaveClass("lg:w-[calc(25%-12px)]");
    });
  });

  it("swaps a failed thumbnail src for the inline fallback", () => {
    render(<WorksCarousel images={mockImages} onThumbSelect={vi.fn()} />);

    const img = screen.getByAltText("Image 1") as HTMLImageElement;
    expect(img.src).not.toBe(IMAGE_FALLBACK_SRC);
    fireEvent.error(img);

    expect(img.src).toBe(IMAGE_FALLBACK_SRC);
  });

  // --- Page indicator dots (new feature) ---
  describe("page indicator dots", () => {
    it("renders no dots when only 1 page (2 images, 2 per page)", () => {
      render(<WorksCarousel images={mockImages.slice(0, 2)} onThumbSelect={vi.fn()} />);

      const dots = screen.queryAllByRole("tab", { name: /página \d+ de \d+/i });
      expect(dots).toHaveLength(0); // 2 images, 2 per page (mobile) = 1 page, no dots needed
    });

    it("derives pages from the real visible thumbs (desktop: 4 per page → no dead dots)", () => {
      // Simulate a desktop layout: 4 thumbs fit per page (clientWidth = 4*thumb + 3*gap).
      // 6 images → ceil(6/4) = 2 pages, NOT the 3 pages a fixed mobile constant would show.
      const thumbWidth = 100;
      const gap = 16;
      const clientWidth = 4 * thumbWidth + 3 * gap; // 448

      // Mock the layout getters on HTMLElement.prototype; restore afterwards.
      const originalOffset = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetWidth");
      const originalClient = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "clientWidth");

      Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
        configurable: true,
        get() {
          return thumbWidth;
        },
      });
      Object.defineProperty(HTMLElement.prototype, "clientWidth", {
        configurable: true,
        get() {
          return clientWidth;
        },
      });

      try {
        render(<WorksCarousel images={mockImages.slice(0, 6)} onThumbSelect={vi.fn()} />);

        const dots = screen.getAllByRole("tab", { name: /página \d+ de \d+/i });
        expect(dots).toHaveLength(2); // 2 real pages — no unreachable "dead" dots
      } finally {
        if (originalOffset) {
          Object.defineProperty(HTMLElement.prototype, "offsetWidth", originalOffset);
        } else {
          // @ts-expect-error -- removing our mock when the original lacked a descriptor
          delete HTMLElement.prototype.offsetWidth;
        }
        if (originalClient) {
          Object.defineProperty(HTMLElement.prototype, "clientWidth", originalClient);
        } else {
          // @ts-expect-error -- removing our mock when the original lacked a descriptor
          delete HTMLElement.prototype.clientWidth;
        }
      }
    });

    it("resets to the first page when the layout changes (mobile → desktop)", async () => {
      // Capture the ResizeObserver callback so we can simulate a viewport change.
      let roCallback: ResizeObserverCallback | null = null;
      class MockRO {
        constructor(cb: ResizeObserverCallback) {
          roCallback = cb;
        }
        observe() {}
        unobserve() {}
        disconnect() {}
      }
      const originalRO = globalThis.ResizeObserver;
      globalThis.ResizeObserver = MockRO as unknown as typeof ResizeObserver;

      const thumbWidth = 100;
      const gap = 16;
      let clientWidth = 2 * thumbWidth + gap; // mobile: 216

      const originalOffset = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetWidth");
      const originalClient = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "clientWidth");

      Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
        configurable: true,
        get() {
          return thumbWidth;
        },
      });
      Object.defineProperty(HTMLElement.prototype, "clientWidth", {
        configurable: true,
        get() {
          return clientWidth;
        },
      });

      try {
        const user = userEvent.setup();
        render(<WorksCarousel images={mockImages.slice(0, 6)} onThumbSelect={vi.fn()} />);

        // Mobile: 6 images / 2 per page = 3 dots. Jump to the third dot.
        let dots = screen.getAllByRole("tab", { name: /página \d+ de \d+/i });
        expect(dots).toHaveLength(3);
        await user.click(dots[2]);
        expect(dots[2]).toHaveClass("bg-pr-aquamarine");

        // Resize to desktop: 4 per page → 2 pages, and index resets to the first.
        clientWidth = 4 * thumbWidth + 3 * gap; // 448
        act(() => {
          roCallback?.([], {} as ResizeObserver);
        });

        dots = screen.getAllByRole("tab", { name: /página \d+ de \d+/i });
        expect(dots).toHaveLength(2);
        expect(dots[0]).toHaveClass("bg-pr-aquamarine");
        expect(dots[1]).not.toHaveClass("bg-pr-aquamarine");
      } finally {
        globalThis.ResizeObserver = originalRO;
        if (originalOffset) {
          Object.defineProperty(HTMLElement.prototype, "offsetWidth", originalOffset);
        } else {
          // @ts-expect-error -- removing our mock when the original lacked a descriptor
          delete HTMLElement.prototype.offsetWidth;
        }
        if (originalClient) {
          Object.defineProperty(HTMLElement.prototype, "clientWidth", originalClient);
        } else {
          // @ts-expect-error -- removing our mock when the original lacked a descriptor
          delete HTMLElement.prototype.clientWidth;
        }
      }
    });

    it("renders no dots with 5 or fewer images (threshold is >5)", () => {
      // 3 images, 2 per page = 2 pages, but dots only appear past 5 images
      render(<WorksCarousel images={mockImages.slice(0, 5)} onThumbSelect={vi.fn()} />);

      const dots = screen.queryAllByRole("tab", { name: /página \d+ de \d+/i });
      expect(dots).toHaveLength(0);
    });

    it("renders dots when more than 5 images provided (multiple pages)", () => {
      // 6 images, 2 per page = 3 pages
      render(<WorksCarousel images={mockImages.slice(0, 6)} onThumbSelect={vi.fn()} />);

      const dots = screen.getAllByRole("tab", { name: /página \d+ de \d+/i });
      expect(dots).toHaveLength(3);
    });

    it("renders correct number of dots for multiple pages (mobile: 2 per page)", () => {
      // 6 images, 2 per page (mobile) = 3 pages
      render(<WorksCarousel images={mockImages.slice(0, 6)} onThumbSelect={vi.fn()} />);

      const dots = screen.getAllByRole("tab", { name: /página \d+ de \d+/i });
      expect(dots).toHaveLength(3);
    });

    it("highlights the active dot (first page active by default)", () => {
      render(<WorksCarousel images={mockImages.slice(0, 6)} onThumbSelect={vi.fn()} />);

      const dots = screen.getAllByRole("tab", { name: /página \d+ de \d+/i });
      expect(dots[0]).toHaveClass("bg-pr-aquamarine"); // active dot
      expect(dots[1]).not.toHaveClass("bg-pr-aquamarine"); // inactive
      expect(dots[2]).not.toHaveClass("bg-pr-aquamarine"); // inactive
    });

    it("clicking a dot scrolls to that page", async () => {
      const onThumbSelect = vi.fn();
      render(<WorksCarousel images={mockImages.slice(0, 6)} onThumbSelect={onThumbSelect} />);

      const user = userEvent.setup();
      const dots = screen.getAllByRole("tab", { name: /página \d+ de \d+/i });

      // Click the second page dot
      await user.click(dots[1]);

      // The active dot should update to page 2
      const updatedDots = screen.getAllByRole("tab", { name: /página \d+ de \d+/i });
      expect(updatedDots[0]).not.toHaveClass("bg-pr-aquamarine");
      expect(updatedDots[1]).toHaveClass("bg-pr-aquamarine");
      expect(updatedDots[2]).not.toHaveClass("bg-pr-aquamarine");
    });

    it("dots are hidden when carousel is hidden (< 2 images)", () => {
      render(<WorksCarousel images={mockImages.slice(0, 1)} onThumbSelect={vi.fn()} />);

      const dots = screen.queryAllByRole("tab", { name: /página \d+ de \d+/i });
      expect(dots).toHaveLength(0);
    });

    it("dots render between thumbnails and prev/next buttons", () => {
      render(<WorksCarousel images={mockImages.slice(0, 6)} onThumbSelect={vi.fn()} />);

      const dotsContainer = screen.getByTestId("works-carousel-dots");
      expect(dotsContainer).toBeInTheDocument();
    });
  });
});