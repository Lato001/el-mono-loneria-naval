import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import { Modal } from "../Modal";
import { IMAGE_FALLBACK_SRC, useImageFallback } from "../ImageFallback";

const useMedia = (
  queries: string[],
  values: number[],
  defaultValue: number,
): number => {
  const get = useCallback(
    () =>
      values[queries.findIndex((q) => matchMedia(q).matches)] ?? defaultValue,
    [queries, values, defaultValue],
  );

  const [value, setValue] = useState<number>(get);

  useEffect(() => {
    const handler = () => setValue(get);
    // Evaluate immediately: if the queries change (e.g. Fast Refresh with new
    // breakpoints), the stored state must follow, not wait for a viewport change.
    handler();
    queries.forEach((q) => matchMedia(q).addEventListener("change", handler));
    return () =>
      queries.forEach((q) =>
        matchMedia(q).removeEventListener("change", handler),
      );
  }, [queries, get]);

  return value;
};

const useMeasure = <T extends HTMLElement>() => {
  const [node, setNode] = useState<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!node) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(node);
    return () => ro.disconnect();
  }, [node]);

  const ref = useCallback((element: T | null) => {
    setNode(element);
  }, []);

  return [ref, size, node] as const;
};

export interface Item {
  id: string;
  img: string;
  url?: string;
  alt?: string;
  title?: string;
  redirectUrl?: string;
  /** ID of the trabajo this image belongs to — enables click→showcase navigation */
  trabajoId?: string;
  /** Category slug — enables filtering and hash sync */
  categoria?: string;
  /** Optional card eyebrow shown above the title (Home mosaic presentation). */
  eyebrow?: string;
  /** Optional chips shown under the title (Home mosaic presentation). */
  chips?: string[];
}

interface GridItem extends Item {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface MasonryProps {
  items: Item[];
  /**
   * Build-time image dimensions (resolved URL → { w, h }). When provided, the
   * uniform packing uses real aspect ratios without downloading the images;
   * missing URLs fall back to a 4/3 ratio. Optional — Home's mosaic variant
   * ignores aspect ratios (fixed row height).
   */
  imageDims?: Record<string, { w: number; h: number }>;
  variant?: "uniform" | "mosaic";
  ease?: string;
  duration?: number;
  stagger?: number;
  scaleOnHover?: boolean;
  hoverScale?: number;
  blurToFocus?: boolean;
  colorShiftOnHover?: boolean;
  /** Optional click handler — when provided, clicking an item calls this instead of opening the internal Modal */
  onItemClick?: (item: Item, index: number) => void;
}

const Masonry: React.FC<MasonryProps> = ({
  items,
  imageDims,
  variant = "uniform",
  ease = "power3.out",
  stagger = 0.05,
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false,
  onItemClick,
}) => {
  const columns = useMedia(
    [
      "(min-width:2000px)",
      "(min-width:1400px)",
      "(min-width:800px)",
    ],
    [6, 5, 3],
    // Mobile-first floor: never fewer than 2 columns.
    2,
  );

  const isMobile = useMedia(["(max-width: 767px)"], [1], 0) === 1;

  // Home mosaic: always 2x2 on desktop (mirrors the SplitCards grid above it,
  // so both sections share the same card size). The old 4-in-a-row behavior
  // on very large screens made the cards smaller than the SplitCards.
  const itemsPerRow = variant === "mosaic" ? 2 : 1;

  const [containerRef, { width }] = useMeasure<HTMLDivElement>();

  const { grid, totalHeight } = useMemo(() => {
    if (!width) return { grid: [] as GridItem[], totalHeight: 0 };
    const colHeights = new Array(columns).fill(0);
    const gap = 16;
    const totalGaps = (columns - 1) * gap;
    const columnWidth = (width - totalGaps) / columns;
    const gridItems: GridItem[] = [];

    if (variant === "mosaic") {
      for (let rowIdx = 0; rowIdx < items.length; rowIdx += itemsPerRow) {
        const rowItems = items.slice(rowIdx, rowIdx + itemsPerRow);
        // 2x2 cards are equal width. 4-in-a-row are also equal width.
        const flexes = rowItems.map(() => 1);
        const totalFlex = flexes.reduce((s, v) => s + v, 0);
        const usableWidth = width - (rowItems.length - 1) * gap;

        const rowY = gridItems.length === 0
          ? 0
          : Math.max(...gridItems.map((g) => g.y + g.h)) + gap;
        // 2 cols → row height = usableWidth / 3.5 keeps a 1.75 card aspect (shorter
        // than the 4/3 SplitCards above, per user preference).
        const rowHeight = usableWidth / 3.5;
        let rowX = 0;

        rowItems.forEach((child, i) => {
          const itemWidth = (flexes[i] / totalFlex) * usableWidth;
          gridItems.push({ ...child, x: rowX, y: rowY, w: itemWidth, h: rowHeight });
          rowX += itemWidth + gap;
        });
      }

      const totalHeight =
        gridItems.length > 0
          ? Math.max(...gridItems.map((g) => g.y + g.h)) - gap
          : 0;
      return { grid: gridItems, totalHeight };
    } else {
      items.forEach((child) => {
        const col = colHeights.indexOf(Math.min(...colHeights));
        const x = col * (columnWidth + gap);
        const dims = imageDims?.[child.img];
        const aspectRatio = dims ? dims.w / dims.h : 4 / 3;
        const height = columnWidth / aspectRatio;
        const y = colHeights[col];
        colHeights[col] += height + gap;
        gridItems.push({ ...child, x, y, w: columnWidth, h: height });
      });
    }

    const totalHeight =
      gridItems.length > 0 ? Math.max(...colHeights) - gap : 0;
    return { grid: gridItems, totalHeight };
  }, [columns, imageDims, items, itemsPerRow, variant, width]);

  // Item ids that already played their entrance animation. When the items array
  // grows (e.g. the Works album "Cargar más" batch), only the NEW items get the
  // entrance animation; already-visible items are left untouched (their position
  // lives in inline top/left/width/height styles, so React keeps them in place
  // across re-renders — no GSAP repositioning needed on resize).
  const animatedIdsRef = useRef<Set<string>>(new Set());

  useLayoutEffect(() => {
    grid.forEach((item, index) => {
      if (animatedIdsRef.current.has(item.id)) return;

      const selector = `[data-key="${item.id}"]`;
      // Cells are positioned by layout (inline top/left/width/height), so the
      // entrance is a fade + blur in place — no spatial movement. Animating
      // transforms on top of will-change + opacity:0 made Chrome defer the lazy
      // image fetch until hover, breaking `loading="lazy"`.
      gsap.fromTo(
        selector,
        {
          opacity: 0,
          ...(blurToFocus && { filter: "blur(10px)" }),
        },
        {
          opacity: 1,
          ...(blurToFocus && { filter: "blur(0px)" }),
          duration: 0.8,
          ease,
          delay: index * stagger,
        },
      );
      animatedIdsRef.current.add(item.id);
    });
  }, [grid, stagger, ease, blurToFocus]);

  const handleMouseEnter = (id: string, element: HTMLElement) => {
    if (scaleOnHover) {
      gsap.to(`[data-key="${id}"]`, {
        scale: hoverScale,
        duration: 0.3,
        ease: "power2.out",
      });
    }
    if (colorShiftOnHover) {
      const overlay = element.querySelector(".color-overlay") as HTMLElement;
      if (overlay) gsap.to(overlay, { opacity: 0.3, duration: 0.3 });
    }
  };

  const handleMouseLeave = (id: string, element: HTMLElement) => {
    if (scaleOnHover) {
      gsap.to(`[data-key="${id}"]`, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    }
    if (colorShiftOnHover) {
      const overlay = element.querySelector(".color-overlay") as HTMLElement;
      if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.3 });
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [selectedAlt, setSelectedAlt] = useState<string>("");
  const { failed, markFailed } = useImageFallback();

  function handleOpenModal(img: string, alt?: string) {
    setSelectedImg(img);
    setSelectedAlt(alt ?? "");
    setIsModalOpen(true);
  }

  if (isMobile && variant === "mosaic") {
    return <MobileMosaicCarousel items={items} />;
  }

  return (
    <>
      <div
        ref={containerRef}
        className="relative w-full"
        style={{ height: totalHeight || undefined }}
      >
        {grid.map((item, index) =>
          item.redirectUrl ? (
            <a
              key={item.id}
              data-key={item.id}
              href={item.redirectUrl}
              className="absolute box-content group block rounded-3xl border border-sc-ocean-blue/15 transition-all duration-300 ease-out motion-safe:hover:-translate-y-1 hover:ring-1 hover:ring-pr-aquamarine/50"
              style={{ top: item.y, left: item.x, width: item.w, height: item.h }}
            >
              <div className="relative w-full h-full overflow-hidden rounded-3xl">
                <img
                  src={failed.has(item.img) ? IMAGE_FALLBACK_SRC : item.img}
                  alt={item.alt ?? ""}
                  loading="lazy"
                  decoding="async"
                  onError={() => markFailed(item.img)}
                  className="absolute inset-0 h-full w-full object-cover transition-all duration-500 ease-out brightness-50 grayscale-50 motion-safe:group-hover:scale-105 group-hover:brightness-100 group-hover:grayscale-0"
                />
                {item.title && (
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end p-5">
                    {item.eyebrow && (
                      <p className="font-poppins text-xs uppercase tracking-[0.2em] text-pr-aquamarine">
                        {item.eyebrow}
                      </p>
                    )}
                    <h3 className="mt-1 font-brown uppercase tracking-wider text-white text-2xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)]">
                      {item.title}
                    </h3>
                    {item.chips && item.chips.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {item.chips.map((chip) => (
                          <span
                            key={chip}
                            className="rounded-full border border-pr-aquamarine/30 bg-pr-aquamarine/10 px-3 py-1 font-poppins text-xs font-medium text-pr-aquamarine backdrop-blur"
                          >
                            {chip}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </a>
          ) : (
            <div
              key={item.id}
              data-key={item.id}
              className="absolute box-content"
              style={{ top: item.y, left: item.x, width: item.w, height: item.h }}
              onClick={() => onItemClick ? onItemClick(item, index) : handleOpenModal(item.img, item.alt)}
              onMouseEnter={(e) => handleMouseEnter(item.id, e.currentTarget)}
              onMouseLeave={(e) => handleMouseLeave(item.id, e.currentTarget)}
            >
              <div
                className="relative w-full h-full rounded-[10px] overflow-hidden shadow-[0px_10px_50px_-10px_rgba(0,0,0,0.2)] uppercase text-[10px] leading-2.5 cursor-pointer"
              >
                <img
                  src={failed.has(item.img) ? IMAGE_FALLBACK_SRC : item.img}
                  alt={item.alt ?? ""}
                  loading="lazy"
                  decoding="async"
                  onError={() => markFailed(item.img)}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                {colorShiftOnHover && (
                  <div className="color-overlay absolute inset-0 rounded-xl bg-linear-to-tr from-pr-aquamarine to-pr-hero-blue opacity-0 pointer-events-none" />
                )}
              </div>
            </div>
          ),
        )}
      </div>

      <Modal
        variant="centered"
        size="full"
        className="!bg-transparent !p-0 !shadow-none !border-none"
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
        }}
      >
        <div className="flex items-center justify-center">
          <img
            className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
            src={failed.has(selectedImg!) ? IMAGE_FALLBACK_SRC : selectedImg!}
            alt={selectedAlt}
            onError={() => markFailed(selectedImg!)}
          />
        </div>
      </Modal>
    </>
  );
};

function MobileMosaicCarousel({ items }: { items: Item[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  /** Distance (px) between snap points: 92% slide width + gap-4 (16px). */
  const snapStep = (container: HTMLElement) => container.clientWidth * 0.92 + 16;

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const step = snapStep(el);
    const index = step > 0 ? Math.round(el.scrollLeft / step) : 0;
    setActiveIndex(Math.max(0, Math.min(index, items.length - 1)));
  }, [items.length]);

  const scrollToIndex = useCallback((index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const step = snapStep(el);
    el.scrollTo({ left: index * step, behavior: "smooth" });
  }, []);

  return (
    <div className="relative w-full">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 scrollbar-hide"
        style={{ scrollbarWidth: "none" }}
      >
        {items.map((item) => (
          <div key={item.id} className="w-[92%] shrink-0 snap-start">
            <a
              href={item.redirectUrl ?? "/trabajos#album"}
              className="group block rounded-3xl border border-white/15 transition-all duration-300 ease-out motion-safe:hover:-translate-y-1 hover:ring-1 hover:ring-pr-aquamarine/50"
            >
              <div className="relative w-full aspect-[4/3] overflow-hidden rounded-3xl">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-500 ease-out brightness-50 grayscale-50 motion-safe:group-hover:scale-105 group-hover:brightness-100 group-hover:grayscale-0"
                  style={{ backgroundImage: `url(${item.img})` }}
                />
                {item.title && (
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end p-5">
                    {item.eyebrow && (
                      <p className="font-poppins text-xs uppercase tracking-[0.2em] text-pr-aquamarine">
                        {item.eyebrow}
                      </p>
                    )}
                    <h3 className="mt-1 font-brown uppercase tracking-wider text-white text-2xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)]">
                      {item.title}
                    </h3>
                    {item.chips && item.chips.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {item.chips.map((chip) => (
                          <span
                            key={chip}
                            className="rounded-full border border-pr-aquamarine/30 bg-pr-aquamarine/10 px-3 py-1 font-poppins text-xs font-medium text-pr-aquamarine backdrop-blur"
                          >
                            {chip}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </a>
          </div>
        ))}
      </div>

      {/* Dot indicator: replaces the prev/next buttons on mobile. Clicking a
          dot scrolls the carousel to that slide. */}
      {items.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Ir a la foto ${index + 1} de ${items.length}`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => scrollToIndex(index)}
              className={`h-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pr-aquamarine ${
                index === activeIndex
                  ? "w-6 bg-pr-aquamarine"
                  : "w-2.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Masonry;
