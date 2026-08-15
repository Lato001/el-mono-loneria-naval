import { fireEvent, render, screen } from "@testing-library/react";
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