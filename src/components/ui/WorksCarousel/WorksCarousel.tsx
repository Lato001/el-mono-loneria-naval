import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useProductCarousel } from "../ProductCarousel/useProductCarousel";
import type { WorksCarouselProps } from "./WorksCarousel.types";

export function WorksCarousel({ images, onThumbSelect }: WorksCarouselProps) {
  // Hidden when fewer than 2 extra images
  if (images.length < 2) {
    return null;
  }

  const { scrollRef, prev, next, canPrev, canNext } = useProductCarousel();

  return (
    <div className="mt-8">
      <div
        ref={scrollRef}
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
              src={image.src}
              alt={image.alt}
              className="w-full h-32 object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      <div className="flex justify-center gap-3 mt-4">
        <button
          type="button"
          onClick={prev}
          disabled={!canPrev}
          aria-label="Anterior"
          className="
            rounded-full bg-sc-ocean-blue/80 p-2 text-pr-aquamarine
            backdrop-blur-sm transition-colors
            hover:bg-sc-ocean-blue focus-visible:outline-2 focus-visible:outline-pr-aquamarine
            disabled:opacity-30 disabled:cursor-not-allowed
          "
        >
          <IconChevronLeft className="h-5 w-5" stroke={2} />
        </button>
        <button
          type="button"
          onClick={next}
          disabled={!canNext}
          aria-label="Siguiente"
          className="
            rounded-full bg-sc-ocean-blue/80 p-2 text-pr-aquamarine
            backdrop-blur-sm transition-colors
            hover:bg-sc-ocean-blue focus-visible:outline-2 focus-visible:outline-pr-aquamarine
            disabled:opacity-30 disabled:cursor-not-allowed
          "
        >
          <IconChevronRight className="h-5 w-5" stroke={2} />
        </button>
      </div>
    </div>
  );
}