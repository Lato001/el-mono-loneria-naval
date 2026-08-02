import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { gsap } from "gsap";
import { Modal } from "../Modal";

const useMedia = (
  queries: string[],
  values: number[],
  defaultValue: number,
): number => {
  const get = () =>
    values[queries.findIndex((q) => matchMedia(q).matches)] ?? defaultValue;

  const [value, setValue] = useState<number>(get);

  useEffect(() => {
    const handler = () => setValue(get);
    queries.forEach((q) => matchMedia(q).addEventListener("change", handler));
    return () =>
      queries.forEach((q) =>
        matchMedia(q).removeEventListener("change", handler),
      );
  }, [queries]);

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

interface ImageDimensions {
  url: string;
  naturalWidth: number;
  naturalHeight: number;
}

const preloadImages = async (
  urls: string[],
): Promise<ImageDimensions[]> => {
  const results = await Promise.all(
    urls.map(
      (src) =>
        new Promise<ImageDimensions>((resolve) => {
          const img = new Image();
          img.onload = () =>
            resolve({
              url: src,
              naturalWidth: img.naturalWidth,
              naturalHeight: img.naturalHeight,
            });
          img.onerror = () =>
            resolve({ url: src, naturalWidth: 4, naturalHeight: 3 });
          img.src = src;
        }),
    ),
  );
  return results;
};

interface Item {
  id: string;
  img: string;
  url: string;
  alt?: string;
  title?: string;
  redirectUrl?: string;
}

interface GridItem extends Item {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface MasonryProps {
  items: Item[];
  variant?: "uniform" | "mosaic";
  ease?: string;
  duration?: number;
  stagger?: number;
  animateFrom?: "bottom" | "top" | "left" | "right" | "center" | "random";
  scaleOnHover?: boolean;
  hoverScale?: number;
  blurToFocus?: boolean;
  colorShiftOnHover?: boolean;
}

const Masonry: React.FC<MasonryProps> = ({
  items,
  variant = "uniform",
  ease = "power3.out",
  duration = 0.6,
  stagger = 0.05,
  animateFrom = "bottom",
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false,
}) => {
  const columns = useMedia(
    [
      "(min-width:1500px)",
      "(min-width:1000px)",
      "(min-width:600px)",
      "(min-width:400px)",
    ],
    [5, 4, 3, 2],
    1,
  );

  const isMobile = useMedia(["(max-width: 767px)"], [1], 0) === 1;

  const [containerRef, { width }, containerNode] = useMeasure<HTMLDivElement>();
  const [imagesReady, setImagesReady] = useState(false);
  const [dimensionsMap, setDimensionsMap] = useState<
    Map<string, ImageDimensions>
  >(new Map());

  const getInitialPosition = (item: GridItem) => {
    const containerRect = containerNode?.getBoundingClientRect();
    if (!containerRect) return { x: item.x, y: item.y };

    let direction = animateFrom;
    if (animateFrom === "random") {
      const dirs = ["top", "bottom", "left", "right"];
      direction = dirs[
        Math.floor(Math.random() * dirs.length)
      ] as typeof animateFrom;
    }

    switch (direction) {
      case "top":
        return { x: item.x, y: -200 };
      case "bottom":
        return { x: item.x, y: window.innerHeight + 200 };
      case "left":
        return { x: -200, y: item.y };
      case "right":
        return { x: window.innerWidth + 200, y: item.y };
      case "center":
        return {
          x: containerRect.width / 2 - item.w / 2,
          y: containerRect.height / 2 - item.h / 2,
        };
      default:
        return { x: item.x, y: item.y + 100 };
    }
  };

  useEffect(() => {
    preloadImages(items.map((i) => i.img)).then((dims) => {
      const map = new Map(dims.map((d) => [d.url, d]));
      setDimensionsMap(map);
      setImagesReady(true);
    });
  }, [items]);

  const { grid, totalHeight } = useMemo(() => {
    if (!width) return { grid: [] as GridItem[], totalHeight: 0 };
    const colHeights = new Array(columns).fill(0);
    const gap = 16;
    const totalGaps = (columns - 1) * gap;
    const columnWidth = (width - totalGaps) / columns;
    const gridItems: GridItem[] = [];

    if (variant === "mosaic") {
      const itemsPerRow = 2;

      for (let rowIdx = 0; rowIdx < items.length; rowIdx += itemsPerRow) {
        const rowItems = items.slice(rowIdx, rowIdx + itemsPerRow);
        const flexes = rowItems.map((_, i) => (rowIdx + i) % 2 === 0 ? 2 : 1);
        const totalFlex = flexes.reduce((s, v) => s + v, 0);
        const usableWidth = width - (rowItems.length - 1) * gap;

        const rowY = gridItems.length === 0
          ? 0
          : Math.max(...gridItems.map((g) => g.y + g.h)) + gap;
        const rowHeight = usableWidth / 5;
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
        const dims = dimensionsMap.get(child.img);
        const aspectRatio = dims
          ? dims.naturalWidth / dims.naturalHeight
          : 4 / 3;
        const height = columnWidth / aspectRatio;
        const y = colHeights[col];
        colHeights[col] += height + gap;
        gridItems.push({ ...child, x, y, w: columnWidth, h: height });
      });
    }

    const totalHeight =
      gridItems.length > 0 ? Math.max(...colHeights) - gap : 0;
    return { grid: gridItems, totalHeight };
  }, [columns, dimensionsMap, items, variant, width]);

  const hasMounted = useRef(false);

  useLayoutEffect(() => {
    if (!imagesReady) return;

    grid.forEach((item, index) => {
      const selector = `[data-key="${item.id}"]`;
      const animProps = { x: item.x, y: item.y, width: item.w, height: item.h };

      if (!hasMounted.current) {
        const start = getInitialPosition(item);
        gsap.fromTo(
          selector,
          {
            opacity: 0,
            x: start.x,
            y: start.y,
            width: item.w,
            height: item.h,
            ...(blurToFocus && { filter: "blur(10px)" }),
          },
          {
            opacity: 1,
            ...animProps,
            ...(blurToFocus && { filter: "blur(0px)" }),
            duration: 0.8,
            ease: "power3.out",
            delay: index * stagger,
          },
        );
      } else {
        gsap.to(selector, {
          ...animProps,
          duration,
          ease,
          overwrite: "auto",
        });
      }
    });

    hasMounted.current = true;
  }, [grid, imagesReady, stagger, animateFrom, blurToFocus, duration, ease]);

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
        {grid.map((item) =>
          item.redirectUrl ? (
            <a
              key={item.id}
              data-key={item.id}
              href={item.redirectUrl}
              className="absolute box-content group block rounded-lg transition-all duration-400 ease-out border-2 border-sc-ocean-blue/15 hover:-translate-y-1.5 hover:shadow-xl hover:border-pr-aquamarine hover:ring-2 hover:ring-pr-aquamarine"
              style={{ willChange: "transform, width, height, opacity" }}
            >
              <div className="relative w-full h-full overflow-hidden rounded-lg shadow-[0px_10px_50px_-10px_rgba(0,0,0,0.2)]">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-600 ease-out brightness-50 grayscale-50 group-hover:brightness-100 group-hover:grayscale-0 group-hover:scale-105"
                  style={{ backgroundImage: `url(${item.img})` }}
                />
                {item.title && (
                  <h3 className="absolute inset-0 z-10 flex items-center justify-center font-brown uppercase tracking-wider text-white text-3xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)] pointer-events-none">
                    {item.title}
                  </h3>
                )}
              </div>
            </a>
          ) : (
            <div
              key={item.id}
              data-key={item.id}
              className="absolute box-content"
              style={{ willChange: "transform, width, height, opacity" }}
              onClick={() => handleOpenModal(item.img, item.alt)}
              onMouseEnter={(e) => handleMouseEnter(item.id, e.currentTarget)}
              onMouseLeave={(e) => handleMouseLeave(item.id, e.currentTarget)}
            >
              <div
                className="relative w-full h-full bg-cover bg-center rounded-[10px] shadow-[0px_10px_50px_-10px_rgba(0,0,0,0.2)] uppercase text-[10px] leading-2.5 cursor-pointer"
                style={{ backgroundImage: `url(${item.img})` }}
              >
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
            src={selectedImg!}
            alt={selectedAlt}
          />
        </div>
      </Modal>
    </>
  );
};

export default Masonry;

function MobileMosaicCarousel({ items }: { items: Item[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const prev = useCallback(() => {
    scrollRef.current?.scrollBy({ left: -scrollRef.current.clientWidth, behavior: "smooth" });
  }, []);

  const next = useCallback(() => {
    scrollRef.current?.scrollBy({ left: scrollRef.current.clientWidth, behavior: "smooth" });
  }, []);

  return (
    <div className="relative w-full">
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 scrollbar-hide"
        style={{ scrollbarWidth: "none" }}
      >
        {items.map((item) => (
          <div key={item.id} className="w-[80%] shrink-0 snap-start">
            <a
              href={item.redirectUrl ?? "/trabajos#album"}
              className="group block rounded-lg transition-all duration-400 ease-out border-2 border-white/15 hover:border-pr-aquamarine hover:ring-2 hover:ring-pr-aquamarine"
            >
              <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg shadow-[0px_10px_50px_-10px_rgba(0,0,0,0.2)]">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-600 ease-out brightness-50 grayscale-50 group-hover:brightness-100 group-hover:grayscale-0 group-hover:scale-105"
                  style={{ backgroundImage: `url(${item.img})` }}
                />
                {item.title && (
                  <h3 className="absolute inset-0 z-10 flex items-center justify-center font-brown uppercase tracking-wider text-white text-3xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)] pointer-events-none">
                    {item.title}
                  </h3>
                )}
              </div>
            </a>
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label="Anterior"
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 p-3 shadow-md backdrop-blur-sm transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pr-aquamarine"
      >
        <IconChevronLeft className="h-5 w-5 text-sc-ocean-blue" />
      </button>
      <button
        type="button"
        aria-label="Siguiente"
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 p-3 shadow-md backdrop-blur-sm transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pr-aquamarine"
      >
        <IconChevronRight className="h-5 w-5 text-sc-ocean-blue" />
      </button>
    </div>
  );
}
