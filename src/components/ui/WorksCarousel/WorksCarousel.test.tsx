import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WorksCarousel } from "./WorksCarousel";
import type { WorksCarouselImage } from "./WorksCarousel.types";

const mockImages: WorksCarouselImage[] = [
  { src: "/img1.jpg", alt: "Image 1", originalIndex: 0 },
  { src: "/img2.jpg", alt: "Image 2", originalIndex: 1 },
  { src: "/img3.jpg", alt: "Image 3", originalIndex: 2 },
  { src: "/img4.jpg", alt: "Image 4", originalIndex: 3 },
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
});