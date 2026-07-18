import { useEffect, useState } from "react";
import { useCarousel } from "./useCarousel";
import type { StackedCarouselProps } from "./Carousel.types";

export function StackedCarousel({
  items,
  autoplay = false,
  interval = 4000,
}: StackedCarouselProps) {
  const { activeIndex, next, prev, getCardClasses } = useCarousel();
  const [isHovered, setIsHovered] = useState(false);
  const total = items.length;

  // Autoplay — same pattern as the hero `ImgCard`. Pauses on hover so
  // the user can read a card without it advancing. No-op when there is
  // only 0 or 1 card.
  useEffect(() => {
    if (!autoplay || isHovered || total <= 1) return;
    const timer = setInterval(() => {
      next();
    }, interval);
    return () => clearInterval(timer);
  }, [autoplay, interval, isHovered, total, next]);

  return (
    <div
      className="w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative mx-auto h-145 w-full overflow-x-clip">
        {items.map((item, index) => (
          <article
            key={item.id}
            className={`absolute inset-y-0 left-0 flex w-[80%] flex-col gap-6 rounded-2xl bg-white p-8 shadow-xl transition-all duration-500 ease-in-out ${item.color ?? ""} ${getCardClasses(index, total)}`}
          >
            <h3 className="font-poppins text-xl font-bold uppercase text-sc-ocean-blue">
              {item.title}
            </h3>
            <p className="font-poppins text-base leading-relaxed text-sc-ocean-blue/80">
              {item.description}
            </p>
          </article>
        ))}

        <button
          onClick={prev}
          className="absolute left-4 top-1/2 z-40 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-sc-ocean-blue shadow-lg transition-colors hover:bg-sc-ocean-blue hover:text-white"
          aria-label="Anterior"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={next}
          className="absolute right-4 top-1/2 z-40 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-sc-ocean-blue shadow-lg transition-colors hover:bg-sc-ocean-blue hover:text-white"
          aria-label="Siguiente"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === activeIndex % total
                ? "w-8 bg-pr-aquamarine"
                : "w-2 bg-pr-aquamarine/30"
            }`}
            aria-label={`Ir a slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
