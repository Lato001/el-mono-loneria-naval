import { useCallback, useEffect, useRef, useState } from "react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useProductCarousel } from "../ProductCarousel/useProductCarousel";
import type { WorksCarouselProps } from "./WorksCarousel.types";
import { IconTagStarred } from '@tabler/icons-react';
import { IMAGE_FALLBACK_SRC, useImageFallback } from "../ImageFallback";

/** Horizontal gap between thumbs (matches `gap-4`). */
const THUMB_GAP = 16;

export function WorksCarousel({ images, onThumbSelect }: WorksCarouselProps) {
  const { scrollRef, prev, next, canPrev, canNext } = useProductCarousel();
  const { failed, markFailed } = useImageFallback();

  // Responsive page size: 2 thumbs per page on mobile (w-[calc(50%-8px)]),
  // 4 on lg (lg:w-[calc(25%-12px)]). Deriving pages from a fixed constant
  // would render dead dots on desktop — pages the scroll can never reach.
  const [itemsPerPage, setItemsPerPage] = useState(2);
  const [currentPage, setCurrentPage] = useState(0);
  const [prevImages, setPrevImages] = useState(images);

  const totalPages = Math.max(1, Math.ceil(images.length / itemsPerPage));

  // New work selected → restart from the first page so the dot index never
  // points past the new (possibly shorter) image set.
  if (prevImages !== images) {
    setPrevImages(images);
    setCurrentPage(0);
  }

  useEffect(() => {
    const container = scrollRef.current;
    if (container && container.scrollLeft !== 0) container.scrollLeft = 0;
  }, [images, scrollRef]);

  // Measure how many thumbs actually fit, on mount and on resize. When the
  // visible count changes (breakpoint crossed, e.g. mobile → desktop), the
  // page count and its indexes change meaning — restart from the first page
  // instead of carrying a stale dot position into the new layout.
  const measuredRef = useRef(itemsPerPage);
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const measure = () => {
      const firstThumb = container.querySelector<HTMLElement>("button");
      if (!firstThumb) return;
      const thumbWidth = firstThumb.offsetWidth;
      if (thumbWidth <= 0) return;
      const visible = Math.max(
        1,
        Math.round((container.clientWidth + THUMB_GAP) / (thumbWidth + THUMB_GAP)),
      );
      if (visible === measuredRef.current) return;
      measuredRef.current = visible;
      setItemsPerPage(visible);
      setCurrentPage(0);
      container.scrollLeft = 0;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    return () => ro.disconnect();
  }, [scrollRef, images]);

  // Throttles scroll→page updates to one per animation frame. `scrollBy({behavior:"smooth"})`
  // fires dozens of scroll events per second; without this, each event re-renders the
  // carousel and drops the FPS of prev/next. The pending frame is cancelled on unmount.
  const rafRef = useRef<number | null>(null);
  const handleScroll = useCallback(() => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const container = scrollRef.current;
      if (!container) return;
      // One full page = clientWidth + one gap (each page carries `itemsPerPage`
      // thumbs plus their inter-gaps; see the ResizeObserver measurement above).
      const pageWidth = container.clientWidth + THUMB_GAP;
      const page = Math.round(container.scrollLeft / pageWidth);
      setCurrentPage((prev) => {
        const next = Math.max(0, Math.min(page, totalPages - 1));
        return next === prev ? prev : next;
      });
    });
  }, [scrollRef, totalPages]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  const goToPage = useCallback(
    (page: number) => {
      const container = scrollRef.current;
      if (!container) return;
      const clampedPage = Math.max(0, Math.min(page, totalPages - 1));
      const pageWidth = container.clientWidth + THUMB_GAP;
      container.scrollLeft = clampedPage * pageWidth;
      setCurrentPage(clampedPage);
    },
    [scrollRef, totalPages],
  );

  // Hidden when fewer than 2 extra images — after all hooks (rules-of-hooks)
  if (images.length < 2) {
    return null;
  }

  return (
    <div className="mt-8" role="region" aria-label="Works carousel">
      <div>
        <div className="font-poppins font-bold flex text-pr-aquamarine ">
        <IconTagStarred className="mr-1.5" stroke={2} />
        <h1 >Trabajos Similares</h1>
        </div>
        <div className="rounded-2xl p-4">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 scrollbar-hide"
            style={{ scrollbarWidth: "none" }}
          >
            {images.map((image) => (
              <button
                key={image.originalIndex}
                type="button"
                onClick={() => onThumbSelect(image.originalIndex)}
                className="
              w-[calc(50%-8px)] shrink-0 snap-start lg:w-[calc(25%-12px)]
              rounded-xl overflow-hidden
              shadow-lg transition-all duration-200
              hover:shadow-xl hover:-translate-y-1
              focus-visible:outline-2 focus-visible:outline-pr-aquamarine focus-visible:outline-offset-2
            "
                role="button"
                aria-label={`thumbnail ${image.originalIndex + 1} de ${images.length}: ${image.alt}`}
              >
                <img
                  src={failed.has(image.src) ? IMAGE_FALLBACK_SRC : image.src}
                  alt={image.alt}
                  className="w-full h-32 object-cover"
                  loading="lazy"
                  decoding="async"
                  onError={() => markFailed(image.src)}
                />
              </button>
            ))}
          </div>

          {/* Navigation row — hero-style glassmorphism buttons + per-page dots.
              Dots shown only when there are more than 5 images (multiple pages). */}
          <div className="mt-4 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={prev}
              disabled={!canPrev}
              aria-label="Anterior"
              className="
            cursor-pointer rounded-full border border-pr-aquamarine/30 bg-pr-aquamarine/10
            p-3 text-pr-aquamarine shadow-md backdrop-blur-md transition-all duration-300
            hover:border-pr-aquamarine/60 hover:bg-pr-aquamarine/20
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pr-aquamarine
            disabled:opacity-30 disabled:cursor-not-allowed disabled:pointer-events-none
          "
            >
              <IconChevronLeft className="size-6" stroke={3} />
            </button>

            {images.length > 5 && (
              <div
                data-testid="works-carousel-dots"
                className="flex items-center gap-2"
                role="tablist"
                aria-label="Páginas del carrusel"
              >
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => goToPage(i)}
                    role="tab"
                    aria-selected={i === currentPage}
                    aria-label={`Página ${i + 1} de ${totalPages}`}
                    className={`h-2 cursor-pointer rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pr-aquamarine ${
                      i === currentPage
                        ? "w-4 bg-pr-aquamarine"
                        : "w-2 bg-white/40 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={next}
              disabled={!canNext}
              aria-label="Siguiente"
              className="
            cursor-pointer rounded-full border border-pr-aquamarine/30 bg-pr-aquamarine/10
            p-3 text-pr-aquamarine shadow-md backdrop-blur-md transition-all duration-300
            hover:border-pr-aquamarine/60 hover:bg-pr-aquamarine/20
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pr-aquamarine
            disabled:opacity-30 disabled:cursor-not-allowed disabled:pointer-events-none
          "
            >
              <IconChevronRight className="size-6" stroke={3} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}