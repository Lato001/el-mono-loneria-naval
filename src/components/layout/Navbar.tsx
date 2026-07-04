import { useEffect, useState } from "react";
import { PATHS } from "../../routes/routes";
import { IconMenu2, IconX } from "@tabler/icons-react";

const NAV_LINKS = [
  { href: PATHS.HOME, label: "Inicio" },
  { href: PATHS.SERVICES, label: "Servicios" },
  { href: PATHS.ABOUT_US, label: "Nosotros" },
  { href: PATHS.FAQ, label: "FAQ" },
  { href: PATHS.CONTACT, label: "Contacto" },
];

const BREAKPOINT = 800;

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= BREAKPOINT,
  );

  // Escucha el cambio de breakpoint, no cada pixel de resize
  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${BREAKPOINT}px)`);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
      if (e.matches) setIsOpen(false); // cierra el sidebar si pasa a desktop
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Bloquea el scroll del body mientras el sidebar está abierto
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {isDesktop && (
        <nav className="bg-pr-hero-blue relative z-40">
          <div className="mx-auto flex w-full items-center justify-center gap-8 px-6 py-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-white font-brown font-weight-100 hover:text-pr-aquamarine transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      )}
      {/* Botón flotante, solo en mobile (<800px) */}
      {!isDesktop && (
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={
            isOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"
          }
          aria-expanded={isOpen}
          aria-controls="mobile-sidebar"
          className="fixed top-4 right-4 z-50 p-3 rounded-xl bg-pr-hero-blue shadow-lg hover:bg-pr-aquamarine/20 transition-colors"
        >
          {isOpen ? (
            <IconX className="text-white rotate-90 transition-transform" />
          ) : (
            <IconMenu2 className="text-white" />
          )}
        </button>
      )}
      {/* Overlay + Sidebar, solo en mobile */}
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
            className={`fixed top-0 right-0 h-full w-64 bg-pr-hero-blue shadow-lg z-40
              transform transition-transform duration-300 ease-in-out
              ${isOpen ? "translate-x-0" : "translate-x-full"}`}
          >
            <div className="flex flex-col gap-6 px-6 pt-20">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-white font-brown font-weight-100 hover:text-pr-aquamarine transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </aside>
        </>
      )}
    </>
  );
}
