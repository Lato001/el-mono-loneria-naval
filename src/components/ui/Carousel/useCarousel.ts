import { useState, useCallback } from "react";

export function useCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const next = useCallback(() => {
    setActiveIndex((prev) => prev + 1);
  }, []);

  const prev = useCallback(() => {
    setActiveIndex((prev) => prev - 1);
  }, []);

  const getCardClasses = useCallback(
    (index: number, total: number) => {
      const offset = ((index - activeIndex) % total + total) % total;

      if (offset === 0)
        return "translate-x-0 scale-100 z-30 opacity-100";
      if (offset === 1)
        return "translate-x-[75%] scale-[0.95] z-20 opacity-100";
      if (offset === 2)
        return "translate-x-[100%] scale-[0.9] z-10 opacity-100";

      return "translate-x-[150%] scale-[0.85] z-0 opacity-0 pointer-events-none";
    },
    [activeIndex],
  );

  return { activeIndex, next, prev, getCardClasses };
}
