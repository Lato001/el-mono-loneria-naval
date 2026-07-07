import { useEffect, useState } from "react";
import { IconHome } from "@tabler/icons-react";
import "./ScrollToTop.css";

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
      className={`fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full border-2 border-pr-aquamarine bg-sc-ocean-blue text-white text-xl animate-pulse-glow transition-all duration-300 hover:scale-105 hover:cursor-pointer hover:brightness-110 focus:outline-none ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <IconHome size={24} />
    </button>
  );
}
