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
    <header className="sticky top-4 z-50 mx-auto w-fit relative">
      <div className="bg-sc-ocean-blue/80 flex items-center gap-4 rounded-full border border-white/10 px-4 py-2 shadow-lg backdrop-blur-xl">
        <Link to={PATHS.HOME} className="flex items-center gap-2 pr-2">
          <img src={isotipo} alt="El Mono" className="h-9" />
          <img
            src={isotipoName}
            alt="El Mono Lonería Naval"
            className="hidden h-6 lg:block"
          />
        </Link>

        <nav
          onMouseLeave={() => setHovered(null)}
          className="relative hidden items-center gap-1 lg:flex"
        >
          {data.nav.header.map((link, i) => (
            <Link
              key={link.href}
              to={link.href}
              onMouseEnter={() => setHovered(i)}
              className={`relative z-10 rounded-full px-4 py-2 text-sm font-bold uppercase transition-colors ${
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

        <div className="hidden lg:block">
          <LinkButton text={data.ui.consultWhatsApp} />
        </div>

        <button
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setMobileOpen((v) => !v)}
          className="lg:hidden"
        >
          <IconMenu2Filled className="h-6 w-6 text-white" />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-sc-ocean-blue absolute left-0 top-full mt-2 w-full flex flex-col gap-1 rounded-3xl border border-white/10 p-4 shadow-lg lg:hidden"
          >
            <button
              aria-label="Cerrar menú"
              onClick={() => setMobileOpen(false)}
              className="self-end"
            >
              <IconXFilled className="h-5 w-5 text-white" />
            </button>
            {data.nav.header.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-full px-4 py-3 text-sm font-bold uppercase transition-colors hover:bg-white/10 ${
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
