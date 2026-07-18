import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Card } from "../Card";
import { useFadeInOnView } from "../../../hooks/useFadeInOnView";
import { useProductCarousel } from "./useProductCarousel";
import { data } from "../../../mocks/data";
import type { ProductCarouselProps } from "./ProductCarousel.types";

function FadeInCard({ children }: { children: React.ReactNode }) {
  const { ref, visible } = useFadeInOnView<HTMLDivElement>({ threshold: 0.1 });
  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
    >
      {children}
    </div>
  );
}

export function ProductCarousel({
  items,
  ariaLabel,
  id,
  isSelected,
  onToggle,
}: ProductCarouselProps) {
  const { scrollRef, activeIndex, totalPages, prev, next, goTo } =
    useProductCarousel(items.length);

  return (
    <section
      id={id}
      role="tabpanel"
      aria-labelledby={`tab-${id}`}
      className="relative py-8"
      style={{ scrollMarginTop: "var(--header-h, 76px)" }}
    >
      <h2 className="font-brown text-2xl flex justify-center text-pr-hero-blue pb-10">
        {id}
      </h2>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory px-6 pb-4 scrollbar-hide"
        style={{ scrollbarWidth: "none" }}
      >
        {items.map((product) => (
          <div
            key={product.id}
            className="w-[calc(75%-4px)] md:w-[calc(20%-13px)] shrink-0 snap-start"
          >
            <FadeInCard>
              <Card
                imageSrc={product.imageSrc}
                title={product.title}
                description={product.description}
                selected={isSelected?.(product.id)}
                onSelectChange={() => onToggle?.(product.id)}
              />
            </FadeInCard>
          </div>
        ))}
      </div>

      {/* Prev/Next buttons */}
      <button
        type="button"
        aria-label={data.ui.prevLabel}
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 p-3 shadow-md backdrop-blur-sm transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pr-aquamarine"
      >
        <IconChevronLeft className="h-5 w-5 text-sc-ocean-blue" />
      </button>
      <button
        type="button"
        aria-label={data.ui.nextLabel}
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 p-3 shadow-md backdrop-blur-sm transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pr-aquamarine"
      >
        <IconChevronRight className="h-5 w-5 text-sc-ocean-blue" />
      </button>

      {/* Dots */}
      <div
        role="tablist"
        aria-label={`${ariaLabel} posición`}
        className="mt-4 flex justify-center gap-2"
      >
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`${data.ui.goToProductLabel} ${i + 1}`}
            aria-current={i === activeIndex ? "true" : undefined}
            onClick={() => goTo(i)}
            className={`min-h-11 min-w-11 flex items-center justify-center rounded-full transition-colors ${
              i === activeIndex
                ? "bg-transparent"
                : "hover:bg-transparent"
            }`}
          >
            <span
              className={`block h-2.5 w-2.5 rounded-full transition-colors ${
                i === activeIndex
                  ? "bg-pr-aquamarine"
                  : "bg-sc-ocean-blue/20 group-hover:bg-sc-ocean-blue/40"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
