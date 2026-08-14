import { useEffect, useMemo, useRef } from "react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { data } from "../../../mocks/data";
import { useVideoCarousel } from "./useVideoCarousel";
import type { VideoCarouselProps } from "./VideoCarousel.types";

export function VideoCarousel({ videos, className = "" }: VideoCarouselProps) {
  const { activeIndex, goTo, goToPrev, goToNext, handleEnded } =
    useVideoCarousel(videos.length);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const supportsWebM = useMemo(() => {
    if (typeof document === "undefined") return true;
    const v = document.createElement("video");
    return v.canPlayType('video/webm; codecs="vp9"') !== "";
  }, []);

  // autoplay as an attribute is only honored when a <video> mounts; toggling
  // it on an already-mounted element does nothing. Attach a src to the active
  // and next videos imperatively and play the active one so advancing
  // (ended/next/prev/dots) starts playback. Every other video is released:
  // pause + remove src + load() frees the browser's decode buffer.
  useEffect(() => {
    try {
      videoRefs.current.forEach((video, i) => {
        if (!video) return;
        const isActive = i === activeIndex;
        const isNext = i === (activeIndex + 1) % videos.length;
        const source = supportsWebM ? videos[i].src : videos[i].srcFallback;
        if (isActive || isNext) {
          if (video.getAttribute("src") !== source) video.src = source;
          if (isActive) {
            video.currentTime = 0;
            video.play().catch(() => {});
          }
        } else {
          video.pause();
          video.removeAttribute("src");
          video.load();
        }
      });
    } catch {
      // Playback API unavailable (e.g. jsdom) or autoplay blocked.
    }
  }, [activeIndex, supportsWebM, videos]);

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
              poster={video.poster}
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
          className="cursor-pointer rounded-full border border-pr-aquamarine/30 bg-pr-aquamarine/10 p-3 text-pr-aquamarine shadow-md backdrop-blur-md transition-all duration-300 hover:border-pr-aquamarine/60 hover:bg-pr-aquamarine/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pr-aquamarine"
        >
          <IconChevronLeft className="size-6" stroke={3} />
        </button>
        <div className="flex gap-2">
          {videos.map((video, index) => (
            <button
              key={video.src}
              type="button"
              aria-label={`${data.ui.goToVideoLabel} ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => goTo(index)}
              className={`h-2 cursor-pointer rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pr-aquamarine ${
                index === activeIndex
                  ? "w-4 bg-pr-aquamarine"
                  : "w-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label={data.ui.nextLabel}
            onClick={goToNext}
            className="cursor-pointer rounded-full border border-pr-aquamarine/30 bg-pr-aquamarine/10 p-3 text-pr-aquamarine shadow-md backdrop-blur-md transition-all duration-300 hover:border-pr-aquamarine/60 hover:bg-pr-aquamarine/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pr-aquamarine"
          >
            <IconChevronRight className="size-6" stroke={3} />
          </button>
        </div>
      </div>
    </div>
  );
}
