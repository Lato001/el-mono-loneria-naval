import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VideoCarousel } from "./VideoCarousel";
import type { VideoItem } from "./VideoCarousel.types";

const mockVideos: VideoItem[] = [
  { src: "/videos/one.webm", srcFallback: "/videos/one.mp4", poster: "/videos/one-poster.webp", alt: "Video uno" },
  { src: "/videos/two.webm", srcFallback: "/videos/two.mp4", poster: "/videos/two-poster.webp", alt: "Video dos" },
  { src: "/videos/three.webm", srcFallback: "/videos/three.mp4", poster: "/videos/three-poster.webp", alt: "Video tres" },
];

let playedElements: HTMLVideoElement[];
let pauseSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  playedElements = [];
  vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(function (
    this: HTMLVideoElement,
  ) {
    playedElements.push(this);
    return Promise.resolve();
  });
  pauseSpy = vi
    .spyOn(HTMLMediaElement.prototype, "pause")
    .mockImplementation(() => {});
  vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {});
  // Force WebM support so the src resolution is deterministic in jsdom.
  vi.spyOn(HTMLMediaElement.prototype, "canPlayType").mockReturnValue("maybe");
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("VideoCarousel", () => {
  it("renders nothing when the videos array is empty", () => {
    const { container } = render(<VideoCarousel videos={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders one video element per item", () => {
    const { container } = render(<VideoCarousel videos={mockVideos} />);
    expect(container.querySelectorAll("video")).toHaveLength(3);
  });

  it("mounts all videos but only the active one is visible", () => {
    const { container } = render(<VideoCarousel videos={mockVideos} />);
    const videos = container.querySelectorAll("video");
    expect(videos[0].className).toContain("opacity-100");
    expect(videos[1].className).toContain("opacity-0");
    expect(videos[2].className).toContain("opacity-0");
  });

  it("eager-loads the active video and defers the rest", () => {
    const { container } = render(<VideoCarousel videos={mockVideos} />);
    const videos = container.querySelectorAll("video");
    expect(videos[0]).toHaveAttribute("preload", "auto");
    expect(videos[0]).toHaveAttribute("src", mockVideos[0].src);
    expect(videos[1]).toHaveAttribute("preload", "metadata");
    expect(videos[1]).toHaveAttribute("src", mockVideos[1].src);
    expect(videos[2]).toHaveAttribute("preload", "none");
    expect(videos[2]).not.toHaveAttribute("src");
  });

  it("autoplays only the active video", () => {
    const { container } = render(<VideoCarousel videos={mockVideos} />);
    const videos = container.querySelectorAll("video");
    expect(videos[0]).toHaveAttribute("autoplay");
    expect(videos[1]).not.toHaveAttribute("autoplay");
    expect(videos[2]).not.toHaveAttribute("autoplay");
  });

  it("uses the WebM source when supported", () => {
    const { container } = render(<VideoCarousel videos={mockVideos} />);
    const videos = container.querySelectorAll("video");
    expect(videos[0]).toHaveAttribute("src", "/videos/one.webm");
  });

  it("falls back to the MP4 source when WebM is unsupported", () => {
    const canPlayTypeSpy = vi
      .spyOn(HTMLMediaElement.prototype, "canPlayType")
      .mockReturnValue("");
    const { container } = render(<VideoCarousel videos={mockVideos} />);
    const videos = container.querySelectorAll("video");
    expect(videos[0]).toHaveAttribute("src", "/videos/one.mp4");
    canPlayTypeSpy.mockRestore();
  });

  it("renders an individual poster per video", () => {
    const { container } = render(<VideoCarousel videos={mockVideos} />);
    const videos = container.querySelectorAll("video");
    videos.forEach((video, i) => {
      expect(video).toHaveAttribute("poster", mockVideos[i].poster);
    });
  });

  it("releases the src of videos that leave the active/next window", () => {
    const { container } = render(<VideoCarousel videos={mockVideos} />);
    const videos = container.querySelectorAll("video");
    fireEvent(videos[0], new Event("ended"));
    expect(videos[0]).not.toHaveAttribute("src");
    expect(videos[1]).toHaveAttribute("src");
    expect(videos[1]).toHaveAttribute("autoplay");
    expect(videos[2]).toHaveAttribute("src");
  });

  it("advances to the next video when the active one ends", () => {
    const { container } = render(<VideoCarousel videos={mockVideos} />);
    const videos = container.querySelectorAll("video");
    fireEvent(videos[0], new Event("ended"));
    expect(videos[0].className).toContain("opacity-0");
    expect(videos[1].className).toContain("opacity-100");
    expect(videos[1]).toHaveAttribute("preload", "auto");
  });

  it("wraps around from the last video to the first", () => {
    const { container } = render(<VideoCarousel videos={mockVideos} />);
    const videos = container.querySelectorAll("video");
    fireEvent(videos[0], new Event("ended"));
    fireEvent(videos[1], new Event("ended"));
    fireEvent(videos[2], new Event("ended"));
    expect(videos[0].className).toContain("opacity-100");
  });

  it("loops a single video without advancing", () => {
    const { container } = render(<VideoCarousel videos={[mockVideos[0]]} />);
    const video = container.querySelector("video") as HTMLVideoElement;
    expect(video).toHaveAttribute("loop");
    fireEvent(video, new Event("ended"));
    expect(video).toHaveAttribute("autoplay");
    expect(video.className).toContain("opacity-100");
  });

  it("renders prev and next controls", () => {
    render(<VideoCarousel videos={mockVideos} />);
    expect(screen.getByLabelText("Anterior")).toBeInTheDocument();
    expect(screen.getByLabelText("Siguiente")).toBeInTheDocument();
  });

  it("next button advances and wraps", async () => {
    const user = userEvent.setup();
    const { container } = render(<VideoCarousel videos={mockVideos} />);
    const videos = container.querySelectorAll("video");
    await user.click(screen.getByLabelText("Siguiente"));
    expect(videos[1].className).toContain("opacity-100");
    await user.click(screen.getByLabelText("Siguiente"));
    await user.click(screen.getByLabelText("Siguiente"));
    expect(videos[0].className).toContain("opacity-100");
  });

  it("prev button wraps to the last video", async () => {
    const user = userEvent.setup();
    const { container } = render(<VideoCarousel videos={mockVideos} />);
    const videos = container.querySelectorAll("video");
    await user.click(screen.getByLabelText("Anterior"));
    expect(videos[2].className).toContain("opacity-100");
  });

  it("renders dots and jumps to a video on click", async () => {
    const user = userEvent.setup();
    const { container } = render(<VideoCarousel videos={mockVideos} />);
    const videos = container.querySelectorAll("video");
    await user.click(screen.getByLabelText("Ir a video 3"));
    expect(videos[2].className).toContain("opacity-100");
  });

  it("marks videos as decorative for screen readers", () => {
    const { container } = render(<VideoCarousel videos={mockVideos} />);
    container.querySelectorAll("video").forEach((video) => {
      expect(video).toHaveAttribute("aria-hidden", "true");
    });
  });

  it("starts playback of the next video when the active one ends", () => {
    const { container } = render(<VideoCarousel videos={mockVideos} />);
    const videos = container.querySelectorAll("video");
    playedElements = [];
    fireEvent(videos[0], new Event("ended"));
    expect(playedElements).toEqual([videos[1]]);
  });

  it("starts playback automatically when navigating to the next video", async () => {
    const user = userEvent.setup();
    const { container } = render(<VideoCarousel videos={mockVideos} />);
    const videos = container.querySelectorAll("video");
    playedElements = [];
    await user.click(screen.getByLabelText("Siguiente"));
    expect(playedElements).toEqual([videos[1]]);
  });

  it("starts playback automatically when navigating to the previous video", async () => {
    const user = userEvent.setup();
    const { container } = render(<VideoCarousel videos={mockVideos} />);
    const videos = container.querySelectorAll("video");
    playedElements = [];
    await user.click(screen.getByLabelText("Anterior"));
    expect(playedElements).toEqual([videos[2]]);
  });

  it("starts playback automatically when jumping to a video via dots", async () => {
    const user = userEvent.setup();
    const { container } = render(<VideoCarousel videos={mockVideos} />);
    const videos = container.querySelectorAll("video");
    playedElements = [];
    await user.click(screen.getByLabelText("Ir a video 3"));
    expect(playedElements).toEqual([videos[2]]);
  });

  it("pauses the video that leaves the active/next window on navigation", async () => {
    const user = userEvent.setup();
    const { container } = render(<VideoCarousel videos={mockVideos} />);
    const videos = container.querySelectorAll("video");
    pauseSpy.mockClear();
    await user.click(screen.getByLabelText("Siguiente"));
    expect(pauseSpy).toHaveBeenCalledTimes(1);
    expect(pauseSpy.mock.instances).toContain(videos[0]);
  });

  it("restarts the newly active video from the beginning on navigation", async () => {
    const user = userEvent.setup();
    const { container } = render(<VideoCarousel videos={mockVideos} />);
    const videos = container.querySelectorAll("video");
    videos[1].currentTime = 42;
    playedElements = [];
    await user.click(screen.getByLabelText("Siguiente"));
    expect(videos[1].currentTime).toBe(0);
    expect(playedElements).toEqual([videos[1]]);
  });

  it("restarts from the beginning when wrapping around after the last video ends", () => {
    const { container } = render(<VideoCarousel videos={mockVideos} />);
    const videos = container.querySelectorAll("video");
    fireEvent(videos[0], new Event("ended"));
    fireEvent(videos[1], new Event("ended"));
    videos[0].currentTime = 10;
    fireEvent(videos[2], new Event("ended"));
    expect(videos[0].currentTime).toBe(0);
  });
});