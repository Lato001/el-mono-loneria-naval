import { useCallback, useRef } from "react";

export function useProductCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

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

  return { scrollRef, prev, next };
}
