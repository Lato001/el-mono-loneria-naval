import { useCallback, useEffect, useRef, useState } from "react";

export function useProductCarousel(itemCount: number) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPageRef = useRef(1);
  const rafRef = useRef<number | null>(null);

  // Compute items-per-page from container/card widths on mount and resize
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const compute = () => {
      const firstCard = container.firstElementChild as HTMLElement | null;
      if (!firstCard) return;
      const containerWidth = container.clientWidth;
      const cardWidth = firstCard.getBoundingClientRect().width;
      const gap = 16; // gap-4
      const ipp = Math.max(1, Math.floor((containerWidth + gap) / (cardWidth + gap)));
      itemsPerPageRef.current = ipp;
      setTotalPages(Math.ceil(itemCount / ipp));
    };

    compute();
    // Re-compute on resize (lightweight — no ResizeObserver needed for v1)
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [itemCount]);

  // Track active page from scroll position (rAF-throttled)
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const onScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const scrollLeft = container.scrollLeft;
        const children = Array.from(container.children) as HTMLElement[];
        const ipp = itemsPerPageRef.current;

        // Find first card whose offsetLeft >= scrollLeft - tolerance
        let cardIndex = 0;
        for (let i = 0; i < children.length; i++) {
          if (children[i].offsetLeft >= scrollLeft - 2) {
            cardIndex = i;
            break;
          }
        }
        setActiveIndex(Math.floor(cardIndex / ipp));
      });
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const prev = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.scrollBy({ left: -container.clientWidth, behavior: "smooth" });
  }, []);

  const next = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.scrollBy({ left: container.clientWidth, behavior: "smooth" });
  }, []);

  const goTo = useCallback((pageIndex: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const ipp = itemsPerPageRef.current;
    const firstCard = container.firstElementChild as HTMLElement | null;
    if (!firstCard) return;
    const cardWidth = firstCard.getBoundingClientRect().width;
    const gap = 16;
    const targetScroll = pageIndex * ipp * (cardWidth + gap);
    container.scrollTo({ left: targetScroll, behavior: "smooth" });
  }, []);

  return { scrollRef, activeIndex, totalPages, prev, next, goTo };
}
