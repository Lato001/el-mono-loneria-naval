import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { IMAGE_FALLBACK_SRC, useImageFallback } from "../ImageFallback";

interface ImgCardProps {
  src?: string;
  alt?: string;
  images?: { src: string; alt: string }[];
  interval?: number;
  className?: string;
  title?: string;
  imageClassName?: string;
  showControls?: boolean;
  actionButton?: ReactNode;
  overlay?: ReactNode;
  /**
   * Loading strategy for the single-image render. Defaults to "lazy" because
   * most single-image usages (FAQ bubbles, split cards) sit below the fold.
   * Above-the-fold consumers (the Works showcase) pass "eager".
   */
  loading?: "lazy" | "eager";
}

export function ImgCard({
  src,
  alt,
  images,
  interval = 4000,
  className = "",
  title,
  imageClassName = "",
  showControls = false,
  actionButton,
  overlay,
  loading = "lazy",
}: ImgCardProps) {
  const hasSlideshow = images && images.length > 1;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { failed, markFailed } = useImageFallback();

  useEffect(() => {
    if (!hasSlideshow || isHovered) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [hasSlideshow, images, interval, isHovered]);

  const goToPrev = () => {
    if (!images || images.length === 0) return;
    setCurrentIndex((i) => (i - 1 + images.length) % images.length);
  };
  const goToNext = () => {
    if (!images || images.length === 0) return;
    setCurrentIndex((i) => (i + 1) % images.length);
  };

  const actionButtonSlot = actionButton ? (
    <div className="absolute right-2 top-2 z-40">{actionButton}</div>
  ) : null;

  const overlaySlot = overlay ? (
    <div className="absolute inset-0 z-30">{overlay}</div>
  ) : null;

  if (hasSlideshow) {
    return (
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          w-full max-w-md aspect-3/4 relative
          rounded-3xl 
          overflow-hidden
          shadow-[0_20px_45px_-10px_rgba(0,0,0,0.55)]
          ${className}
        `}
      >
        {images.map((img, i) => (
          <img
            key={img.src}
            src={failed.has(img.src) ? IMAGE_FALLBACK_SRC : img.src}
            alt={img.alt}
            decoding="async"
            onError={() => markFailed(img.src)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              i === currentIndex ? "opacity-100" : "opacity-0 "
            } ${imageClassName}`}
          />
        ))}
        {showControls && (
          <>
            <button
              type="button"
              onClick={goToPrev}
              aria-label="Imagen anterior"
              className="absolute left-3 top-1/2 z-20 -translate-y-1/2 cursor-pointer rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pr-aquamarine"
            >
              <IconChevronLeft className="h-5 w-5" stroke={2} />
            </button>
            <button
              type="button"
              onClick={goToNext}
              aria-label="Siguiente imagen"
              className="absolute right-3 top-1/2 z-20 -translate-y-1/2 cursor-pointer rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pr-aquamarine"
            >
              <IconChevronRight className="h-5 w-5" stroke={2} />
            </button>
          </>
        )}
        {title && (
          <h2 className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center font-brown tracking-wider text-white text-3xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)]">
            {title}
          </h2>
        )}
        {overlaySlot}
        {actionButtonSlot}
      </div>
    );
  }

  return (
    <div
      className={`
         w-full max-w-md aspect-3/4 relative
        rounded-3xl
        overflow-hidden
        shadow-[0_20px_45px_-10px_rgba(0,0,0,0.55)]
        ${className}
      `}
    >
      <img
        src={failed.has(src!) ? IMAGE_FALLBACK_SRC : src}
        alt={alt}
        className={`h-full w-full object-cover ${imageClassName}`}
        loading={loading}
        decoding="async"
        onError={() => markFailed(src!)}
        // Above-the-fold renders (Works showcase) are eager + high priority.
        fetchPriority={loading === "eager" ? "high" : undefined}
        // Single-size assets today. `sizes` stays fixed to the component's real
        // layout so a future build step that generates resized variants can add
        // a proper `srcset` without another layout pass. Browsers ignore `sizes`
        // until `srcset` is present.
        sizes="(max-width: 767px) 100vw, 448px"
      />
      {title && (
        <h2 className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center font-brown uppercase tracking-wider text-white text-3xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)]">
          {title}
        </h2>
      )}
      {overlaySlot}
      {actionButtonSlot}
    </div>
  );
}
