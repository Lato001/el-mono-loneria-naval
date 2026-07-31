import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IconMenu2Filled, IconXFilled } from "@tabler/icons-react";
import isotipo from "../../../assets/logos/elmono/isotipo-elmono.png";
import isotipoName from "../../../assets/logos/elmono/isotipo-elmono-name.png";
import { PATHS } from "../../../routes/routes";
import { data } from "../../../mocks/data";
import { LinkButton } from "../Button/LinkButton";

export function Navbar() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-4 right-4 z-50 flex h-(--nav-h) items-center rounded-full bg-sc-ocean-blue shadow-lg xl2:right-auto xl2:left-1/2 xl2:-translate-x-1/2">
      <div className="flex items-center gap-[clamp(0.5rem,1.5vw,0.75rem)] px-[clamp(0.75rem,2vw,1.25rem)]">
        <Link
          to={PATHS.HOME}
          className="flex shrink-0 items-center gap-[clamp(0.25rem,0.6vw,0.5rem)]"
        >
          <img
            src={isotipo}
            alt="El Mono"
            className="h-[calc(var(--nav-h)*0.8)]"
          />
          <img
            src={isotipoName}
            alt="El Mono Lonería Naval"
            className="hidden h-[calc(var(--nav-h)*0.8)] xl2:block"
          />
        </Link>

        <nav
          onMouseLeave={() => setHovered(null)}
          className="relative hidden items-center xl2:flex"
        >
          {data.nav.header.map((link, i) => (
            <Link
              key={link.href}
              to={link.href}
              onMouseEnter={() => setHovered(i)}
              className={`relative z-10 rounded-full px-[calc(var(--nav-h)*0.28)] py-2 text-[calc(var(--nav-h)*0.24)] font-bold uppercase transition-colors ${
                isActive(link.href)
                  ? "text-pr-aquamarine"
                  : "text-white hover:text-pr-aquamarine"
              }`}
            >
              {hovered === i && (
                <motion.div
                  layoutId="navbar-hover-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-white/10"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setMobileOpen((v) => !v)}
          className="xl2:hidden"
        >
          <IconMenu2Filled className="h-[calc(var(--nav-h)*0.42)] w-[calc(var(--nav-h)*0.42)] text-white" />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-sc-ocean-blue absolute top-full right-0 w-[calc(100vw-2rem)] max-w-80 flex flex-col gap-1  mt-2 rounded-2xl px-4 pb-4 shadow-lg xl2:hidden"
          >
            <button
              aria-label="Cerrar menú"
              onClick={() => setMobileOpen(false)}
              className="self-end mt-2 p-1 bg-pr-hero-blue rounded-4xl"
            >
              <IconXFilled className="h-5 w-5 text-pr-aquamarine" />
            </button>
            {data.nav.header.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className={`font-poppins rounded-full px-4 py-3 text-sm font-bold uppercase transition-colors hover:bg-white/10 ${
                  isActive(link.href) ? "text-pr-aquamarine" : "text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <LinkButton text={data.ui.consultWhatsApp} />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
