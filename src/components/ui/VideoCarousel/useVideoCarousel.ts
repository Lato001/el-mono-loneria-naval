import { useCallback, useState } from "react";

export function useVideoCarousel(videoCount: number) {
  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      if (videoCount <= 1) return;
      setActiveIndex(((index % videoCount) + videoCount) % videoCount);
    },
    [videoCount],
  );

  const goToPrev = useCallback(() => {
    if (videoCount <= 1) return;
    setActiveIndex((prev) => (prev - 1 + videoCount) % videoCount);
  }, [videoCount]);

  const goToNext = useCallback(() => {
    if (videoCount <= 1) return;
    setActiveIndex((prev) => (prev + 1) % videoCount);
  }, [videoCount]);

  const handleEnded = useCallback(() => {
    goToNext();
  }, [goToNext]);

  return { activeIndex, goTo, goToPrev, goToNext, handleEnded };
}
