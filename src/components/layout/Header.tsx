import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { IconMenu2, IconX } from "@tabler/icons-react";
import logoSrc from "../../assets/logos/elmono/isotipo-elmono-01.png";
import { PATHS } from "../../routes/routes";

const NAV_LINKS = [
  { href: PATHS.HOME, label: "Inicio" },
  { href: PATHS.SERVICES, label: "Servicios" },
  { href: PATHS.ABOUT_US, label: "Nosotros" },
  { href: PATHS.FAQ, label: "FAQ" },
];

const BREAKPOINT = 800;

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
    <header className="bg-sc-ocean-blue min-h-14">
      <div className="mx-auto flex items-center justify-between px-6 py-2.5 max-w-7xl">
        <Link to={PATHS.HOME} className="shrink-0">
          <img src={logoSrc} alt="El Mono" className="h-auto w-24" />
        </Link>

        {isDesktop && (
          <nav className="flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`relative font-brown font-normal text-base tracking-wider
                  transition-colors duration-300
                  before:absolute before:-inset-y-1.5 before:-inset-x-3.5
                  before:rounded-full before:pointer-events-none
                  before:bg-[radial-gradient(ellipse_at_30%_25%,rgba(255,255,255,0.35)_0%,rgba(64,241,231,0.2)_45%,rgba(64,241,231,0.06)_100%)]
                  before:opacity-0 before:transition-all before:duration-300
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

        {isDesktop && (
          <Link
            to={PATHS.CONTACT}
            className="shrink-0 rounded-lg bg-white px-6 py-2.5 font-poppins font-semibold text-base text-sc-ocean-blue transition-colors hover:bg-sc-chalk"
          >
            Cotizar
          </Link>
        )}

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
            className={`fixed top-0 right-0 h-full w-64 bg-sc-ocean-blue shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${
              isOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex h-full flex-col px-6 pt-24 pb-6">
              <div className="flex flex-col gap-6">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`relative font-brown text-lg
                      transition-colors duration-300
                      before:absolute before:-inset-y-1.75 before:-inset-x-4
                      before:rounded-full before:pointer-events-none
                      before:bg-[radial-gradient(ellipse_at_30%_25%,rgba(255,255,255,0.35)_0%,rgba(64,241,231,0.2)_45%,rgba(64,241,231,0.06)_100%)]
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
              <Link
                to={PATHS.CONTACT}
                onClick={() => setIsOpen(false)}
                className="block rounded-lg bg-white px-6 py-2.5 font-poppins font-semibold text-base text-sc-ocean-blue text-center transition-colors hover:bg-sc-chalk"
              >
                Cotizar
              </Link>
            </div>
          </aside>
        </>
      )}
    </header>
  );
}
