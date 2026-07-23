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
  /**
   * Click handler. When provided, each item becomes a <button> and the
   * grid becomes an interactive index. When omitted, items stay as
   * decorative <div>s (backward compatible with non-interactive uses).
   */
  onSelect?: (id: FaqCategory) => void;
  /**
   * Currently active category. When set alongside onSelect, the matching
   * item gets a visual highlight (brighter border + bg).
   */
  selectedId?: FaqCategory;
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
 * a short uppercase label.
 *
 * Behaviour:
 * - With onSelect: each item is a <button>. Click fires the handler with
 *   the category id. Used as an in-page index that scrolls to the matching
 *   category section.
 * - Without onSelect: each item is a <div>. Decorative only.
 * - With selectedId: the matching item gets a brighter outline + bg.
 */
export function FaqCategoryGrid({
  categories = DEFAULT_CATEGORIES,
  className,
  onSelect,
  selectedId,
}: FaqCategoryGridProps) {
  const isInteractive = Boolean(onSelect);

  return (
    <div
      role={isInteractive ? "navigation" : "region"}
      aria-label="Categorías de preguntas frecuentes"
      className={`rounded-2xl border border-dashed bg-pr-aquamarine/8 p-8 md:p-10 ${className ?? ""}`}
    >
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
        {categories.map((cat) => {
          const isSelected = selectedId === cat.id;
          const highlight = isSelected
            ? "border-pr-aquamarine bg-pr-aquamarine/15 shadow-[0_0_0_2px_var(--aquamarine)]"
            : "border-transparent hover:border-pr-aquamarine/60 hover:bg-pr-aquamarine/10";

          const inner = (
            <>
              <img
                src={cat.icon}
                alt={cat.label}
                className="h-16 w-16 object-contain"
                loading="lazy"
              />
              <span className="font-poppins text-sm font-semibold uppercase tracking-[0.15em] text-sc-chalk">
                {cat.label}
              </span>
            </>
          );

          if (isInteractive && onSelect) {
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelect(cat.id)}
                aria-current={isSelected ? "true" : undefined}
                aria-label={`Ir a preguntas de ${cat.label}`}
                className={`flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 p-4 text-center transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pr-aquamarine ${highlight}`}
              >
                {inner}
              </button>
            );
          }

          return (
            <div
              key={cat.id}
              className="flex flex-col items-center gap-3 text-center"
            >
              {inner}
            </div>
          );
        })}
      </div>
    </div>
  );
}
