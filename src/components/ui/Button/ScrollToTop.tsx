import { useEffect, useState } from "react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsVisible(window.scrollY > 200);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleScrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      type="button"
      onClick={handleScrollToTop}
      aria-label="Volver al inicio"
      className={`fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full border-2 border-accent bg-white/40 text-accent backdrop-blur-md dark:bg-white/10 dark:backdrop-blur-md dark:text-accent shadow-lg transition-all duration-300 hover:scale-105 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-pop/50 ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      I
    </button>
  );
}
