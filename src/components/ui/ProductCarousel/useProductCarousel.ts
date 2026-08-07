import { useCallback, useEffect, useRef, useState } from "react";

/** Tolerance (px) used to avoid jitter at the scroll boundaries. */
const EPSILON = 1;

export function useProductCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  // Re-derive navigation availability from the container's real scroll state.
  // A container with no scrollable overflow naturally yields both `false`.
  const recompute = useCallback(() => {
    const container = scrollRef.current;
    if (!container) {
      setCanPrev(false);
      setCanNext(false);
      return;
    }
    setCanPrev(container.scrollLeft > EPSILON);
    setCanNext(
      container.scrollWidth - container.clientWidth - container.scrollLeft >
        EPSILON,
    );
  }, []);

  const prev = useCallback(() => {
    const container = scrollRef.current;
    if (!container || !canPrev) return;
    container.scrollBy({ left: -container.clientWidth, behavior: "smooth" });
  }, [canPrev]);

  const next = useCallback(() => {
    const container = scrollRef.current;
    if (!container || !canNext) return;
    container.scrollBy({ left: container.clientWidth, behavior: "smooth" });
  }, [canNext]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    recompute();
    container.addEventListener("scroll", recompute, { passive: true });
    const ro = new ResizeObserver(recompute);
    ro.observe(container);
    return () => {
      container.removeEventListener("scroll", recompute);
      ro.disconnect();
    };
  }, [recompute]);

  return { scrollRef, prev, next, canPrev, canNext, recompute };
}