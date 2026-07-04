import { useEffect, useState } from "react";
import logoSrc from "../../assets/img/logo/isotipo-elmono-01.png";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-sc-ocean-blue/80 backdrop-blur-sm" : "bg-sc-ocean-blue"
      }`}
    >
      <div className="mx-auto flex w-full items-center justify-center px-6 py-4">
        <img src={logoSrc} alt="Logo" className="h-auto w-32 md:w-40" />
        {/* espacio para links de navegación futuros */}
      </div>
    </header>
  );
}
