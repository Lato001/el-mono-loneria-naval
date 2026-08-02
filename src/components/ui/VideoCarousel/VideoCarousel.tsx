import { useEffect, useRef } from "react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { data } from "../../../mocks/data";
import { useVideoCarousel } from "./useVideoCarousel";
import type { VideoCarouselProps } from "./VideoCarousel.types";

export function VideoCarousel({ videos, className = "" }: VideoCarouselProps) {
  const { activeIndex, goTo, goToPrev, goToNext, handleEnded } =
    useVideoCarousel(videos.length);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // autoplay as an attribute is only honored when a <video> mounts; toggling
  // it on an already-mounted element does nothing. Play the active video
  // imperatively so advancing (ended/next/prev/dots) starts playback.
  useEffect(() => {
    try {
      videoRefs.current.forEach((video, i) => {
        if (video && i !== activeIndex) video.pause();
      });
      const activeVideo = videoRefs.current[activeIndex];
      if (activeVideo) {
        activeVideo.currentTime = 0;
        activeVideo.play().catch(() => {});
      }
    } catch {
      // Playback API unavailable (e.g. jsdom) or autoplay blocked.
    }
  }, [activeIndex]);

  if (videos.length === 0) return null;

  return (
    <div className={`w-full max-w-md ${className}`}>
      <div className="relative aspect-3/4 w-full overflow-hidden rounded-3xl shadow-[0_20px_45px_-10px_rgba(0,0,0,0.55)]">
        {videos.map((video, index) => {
          const isActive = index === activeIndex;
          const isNext = index === (activeIndex + 1) % videos.length;
          return (
            <video
              key={video.src}
              ref={(el) => {
                videoRefs.current[index] = el;
              }}
              src={video.src}
              muted
              playsInline
              autoPlay={isActive}
              loop={videos.length === 1}
              preload={isActive ? "auto" : isNext ? "metadata" : "none"}
              onEnded={isActive ? handleEnded : undefined}
              aria-hidden="true"
              disablePictureInPicture
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
            />
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-around mx-30">
        <button
          type="button"
          aria-label={data.ui.prevLabel}
          onClick={goToPrev}
          className="cursor-pointer rounded-full bg-sc-ocean-blue p-3 text-sc-chalk shadow-md backdrop-blur-sm transition-colors hover:bg-sc-ocean-blue/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pr-aquamarine"
        >
          <IconChevronLeft className="size-6" stroke={3} />
        </button>
        <div className="flex gap-2">
          {videos.map((video, index) => (
            <button
              key={video.src}
              type="button"
              aria-label={`${data.ui.goToVideoLabel} ${index + 1}`}
              onClick={() => goTo(index)}
              className={`h-2 w-2 cursor-pointer rounded-full transition-colors ${
                index === activeIndex ? "bg-pr-aquamarine" : "bg-white/40"
              }`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label={data.ui.nextLabel}
            onClick={goToNext}
            className="cursor-pointer rounded-full bg-sc-ocean-blue p-3 text-sc-chalk shadow-md backdrop-blur-sm transition-colors hover:bg-sc-ocean-blue/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pr-aquamarine"
          >
            <IconChevronRight className="size-6" stroke={3} />
          </button>
        </div>
      </div>
    </div>
  );
}
