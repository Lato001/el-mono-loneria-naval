import type { FaqCategory } from "../../../mocks/types";
import insumosLogo from "../../../assets/logos/icons/insumos-logo.png";
import serviciosLogo from "../../../assets/logos/icons/servicios-logo.png";
import tiemposLogo from "../../../assets/logos/icons/tiempos-logo.png";
import trabajosLogo from "../../../assets/logos/icons/trabajos-logo.png";

export interface FaqCategoryEntry {
  id: FaqCategory;
  label: string;
  icon: string;
}

interface FaqCategoryGridProps {
  categories?: FaqCategoryEntry[];
  className?: string;
}

const DEFAULT_CATEGORIES: FaqCategoryEntry[] = [
  { id: "servicios", label: "Servicios", icon: serviciosLogo },
  { id: "tiempos", label: "Tiempos", icon: tiemposLogo },
  { id: "insumos", label: "Insumos", icon: insumosLogo },
  { id: "trabajos", label: "Trabajos", icon: trabajosLogo },
];

/**
 * FaqCategoryGrid — a 4-up visual index of the dimensions a customer asks
 * about. Each entry is a self-contained PNG icon (the brand's own art) and
 * a short uppercase label. Used as the signature element of the FAQ page.
 *
 * Decorative by default (no click handler). If filtering is needed in the
 * future, add an onSelect prop and lift category state into the page.
 */
export function FaqCategoryGrid({
  categories = DEFAULT_CATEGORIES,
  className,
}: FaqCategoryGridProps) {
  return (
    <div
      role="region"
      aria-label="Categorías de preguntas frecuentes"
      className={`rounded-2xl border border-dashed   bg-pr-aquamarine/8 p-8 md:p-10 ${className ?? ""}`}
    >
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex flex-col items-center gap-3 text-center"
          >
            <img
              src={cat.icon}
              alt={cat.label}
              className="h-16 w-16 object-contain"
              loading="lazy"
            />
            <span className="font-poppins text-sm font-semibold uppercase tracking-[0.15em] text-sc-chalk">
              {cat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
