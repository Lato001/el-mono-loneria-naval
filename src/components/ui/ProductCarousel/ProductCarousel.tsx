import { useRef } from "react";
import { Card } from "../Card";
import { useFadeInOnView } from "../../../hooks/useFadeInOnView";
import type { ProductCarouselProps } from "./ProductCarousel.types";

function FadeInCard({ children }: { children: React.ReactNode }) {
  const { ref, visible } = useFadeInOnView<HTMLDivElement>({ threshold: 0.1 });
  return (
    <div
      ref={ref}
      className={`h-full transition-all duration-500 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
    >
      {children}
    </div>
  );
}

export function ProductCarousel({
  items,
  id,
  isSelected,
  onToggle,
  scrollRef,
}: ProductCarouselProps) {
  const internalRef = useRef<HTMLDivElement>(null);
  const ref = scrollRef ?? internalRef;

  return (
    <section
      id={id}
      role="tabpanel"
      aria-labelledby={`tab-${id}`}
      className="flex h-full min-w-0 flex-col py-4 md:py-8"
      style={{ scrollMarginTop: "var(--header-h, 76px)" }}
    >
      <div
        ref={ref}
        className="flex min-h-0 flex-1 gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory px-6 pb-4 scrollbar-hide"
        style={{ scrollbarWidth: "none" }}
      >
        {items.map((product) => (
          <div
            key={product.id}
            className="h-full w-[calc(80%-16px)] shrink-0 snap-start md:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)] xl:w-[calc(50%-8px)]"
          >
            <FadeInCard>
              <Card
                imageSrc={product.imageSrc}
                title={product.title}
                imageClassName="xl:h-1/2"
                selected={isSelected?.(product.id)}
                onSelectChange={() => onToggle?.(product.id)}
              />
            </FadeInCard>
          </div>
        ))}
      </div>
    </section>
  );
}
