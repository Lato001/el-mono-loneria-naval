import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { IconMenu2, IconX } from "@tabler/icons-react";
import logoSrc from "../../assets/logos/elmono/isotipo-elmono.png";
import nameLogoSrc from "../../assets/logos/elmono/isotipo-elmono-name.png";
import { PATHS } from "../../routes/routes";
import { data } from "../../mocks/data";
import { LinkButton } from "../ui/Button/LinkButton";

const BREAKPOINT = 1024;

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= BREAKPOINT,
  );
  const location = useLocation();

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${BREAKPOINT}px)`);
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
      if (e.matches) setIsOpen(false);
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const isActive = (path: string) => location.pathname === path;

  return (
    // KEEP IN SYNC with --header-h in src/index.css
    <header className="bg-sc-ocean-blue min-h-14">
      <div className="m-auto flex items-center justify-between px-4 py-2.5 max-w-7xl md:px-6">
        <Link to={PATHS.HOME} className="shrink-0">
          <div className="flex items-center w-24 lg:w-40">
            <img src={logoSrc} alt="El Mono" className="h-auto w-24" />
            <img
              src={nameLogoSrc}
              alt="El Mono"
              className="ml-4 hidden max-w-30 max-h-15 lg:block"
            />
          </div>
        </Link>

        {isDesktop && (
          <nav className="flex items-center gap-8">
            {data.nav.header.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`relative font-brown font-normal text-base tracking-wider
                  transition-colors duration-300
                  hover:before:opacity-100
                  ${
                    isActive(link.href)
                      ? "text-pr-aquamarine before:opacity-100"
                      : "text-white hover:text-pr-aquamarine"
                  }`}
              >
                {isActive(link.href) && (
                  <span
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-0.75"
                    aria-hidden="true"
                  >
                    <span className="block w-1.25 border-t-2 border-dashed border-pr-aquamarine" />
                    <span className="block w-1.25 border-t-2 border-dashed border-pr-aquamarine" />
                    <span className="block w-1.25 border-t-2 border-dashed border-pr-aquamarine" />
                  </span>
                )}
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        {isDesktop && <LinkButton text={data.ui.consultWhatsApp} />}

        {!isDesktop && (
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={
              isOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"
            }
            aria-expanded={isOpen}
            aria-controls="mobile-sidebar"
            className="p-2 rounded-lg text-white hover:text-pr-aquamarine transition-colors"
          >
            {isOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
          </button>
        )}
      </div>

      {!isDesktop && (
        <>
          {isOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
          )}
          <aside
            id="mobile-sidebar"
            className={`fixed top-0 right-0 h-full w-64 bg-linear-to-br from-sc-ocean-blue to-pr-hero-blue shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${
              isOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="relative flex h-full flex-col px-6 pt-24 pb-6">
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Cerrar menú"
                className="absolute top-5 right-5 p-2 rounded-lg text-white hover:text-pr-aquamarine transition-colors"
              >
                <IconX size={24} />
              </button>
              <div className="flex flex-col gap-6">
                {data.nav.header.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`relative font-brown text-lg
                      transition-colors duration-300
                      before:opacity-0 before:transition-all before:duration-300
                      hover:before:opacity-100
                      ${
                        isActive(link.href)
                          ? "text-pr-aquamarine font-semibold before:opacity-100"
                          : "text-white font-medium hover:text-pr-aquamarine"
                      }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="flex-1" />
              <LinkButton text={data.ui.consultWhatsApp}></LinkButton>
            </div>
          </aside>
        </>
      )}
    </header>
  );
}
