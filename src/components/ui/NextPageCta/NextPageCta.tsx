import { Link, useLocation } from "react-router-dom";
import { IconArrowRight } from "@tabler/icons-react";
import { PATHS } from "../../../routes/routes";

/**
 * Canonical route order used for the "next page" CTA at the bottom of every
 * route. The last entry loops back to the first so Contact → Home completes
 * the journey instead of dropping the user off a cliff.
 */
const NEXT_PATH_ORDER: ReadonlyArray<{ path: string; label: string }> = [
  { path: PATHS.HOME, label: "Inicio" },
  { path: PATHS.PRODUCTS, label: "Productos" },
  { path: PATHS.WORKS, label: "Trabajos" },
  { path: PATHS.ABOUT_US, label: "Nosotros" },
  { path: PATHS.FAQ, label: "Preguntas Frecuentes" },
  { path: PATHS.CONTACT, label: "Contacto" },
];

/**
 * "Continue exploring" CTA rendered inside the last section of every route.
 * The aquamarine-on-navy solid button stays high-contrast on both the navy
 * and chalk section backgrounds the project uses, with no backdrop-blur or
 * section-tinted overlay that would otherwise look out of place depending
 * on which section hosts it.
 *
 * Reads the current path from useLocation, finds the next route in the
 * canonical order, and renders nothing when the user is on the 404 fallback
 * (path not in NEXT_PATH_ORDER).
 */
export function NextPageCta() {
  const { pathname } = useLocation();
  const index = NEXT_PATH_ORDER.findIndex((r) => r.path === pathname);
  if (index === -1) return null;
  const next = NEXT_PATH_ORDER[(index + 1) % NEXT_PATH_ORDER.length];
  return (
    <div className="flex justify-center pb-10 pt-12">
      <Link
        to={next.path}
        className="inline-flex items-center gap-3 rounded-full bg-pr-aquamarine px-6 py-3 font-poppins text-base font-bold text-sc-ocean-blue shadow-md transition-all duration-300 hover:scale-105 hover:bg-sc-ocean-blue hover:text-pr-aquamarine hover:shadow-pr-aquamarine/30 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pr-aquamarine"
      >
        Conocé {next.label.toLowerCase()}
        <IconArrowRight size={18} stroke={2.5} aria-hidden="true" />
      </Link>
    </div>
  );
}