import { IconPlus, IconX } from "@tabler/icons-react";
import { data } from "../../../mocks/data";

/* KEEP IN SYNC with measured height of Broche Lona Macho Bronze Blanco at 375px */
export const MOBILE_CARD_HEIGHT = "351px";

export interface CardProps {
  id?: string;
  title?: string;
  description?: string;
  badge?: string;
  imageSrc?: string;
  className?: string;
  color?: string;
  badgeClassName?: string;
  selected?: boolean;
  onSelectChange?: (next: boolean) => void;
}

export const Card = ({
  title,
  description,
  badge,
  imageSrc,
  className,
  color = "#F4F4F4",
  badgeClassName = "bg-pr-aquamarine/80",
  selected,
  onSelectChange,
}: CardProps) => {
  const hasContent = !!(title || description);
  const hasImage = !!(imageSrc || color);
  const isInteractive = !!onSelectChange;

  return (
    <article
      style={description ? { height: MOBILE_CARD_HEIGHT } : undefined}
      className={`relative flex flex-col overflow-hidden rounded-xl border-2 transition-all duration-200 ease-out hover:-translate-y-1.5 hover:shadow-xl ${description ? "md:h-auto" : ""} group
      ${selected ? "border-pr-aquamarine ring-2 ring-pr-aquamarine" : "border-sc-ocean-blue/15 bg-white"}
      ${className ?? ""}`}
    >
      {hasImage && (
        <div className="relative aspect-4/3 w-full shrink-0 overflow-hidden">
          {badge && (
            <span
              className={`text-black absolute top-4 left-4 z-10 rounded-full px-3 py-1 text-xs font-medium ${badgeClassName ?? "bg-sc-sand"}`}
            >
              {badge}
            </span>
          )}

          {imageSrc ? (
            <img
              src={imageSrc}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            />
          ) : (
            <div
              style={{ backgroundColor: color }}
              aria-hidden="true"
              className="h-full w-full transition-transform duration-300 ease-out group-hover:scale-105"
            />
          )}
        </div>
      )}

      {isInteractive && (
        <label
          className={`absolute top-3 right-3 z-20 inline-flex h-11 items-center overflow-hidden rounded-full border-2 border-sc-ocean-blue bg-sc-ocean-blue transition-all duration-200 ease-out cursor-pointer hover:brightness-110 ${
            selected
              ? "w-auto justify-start gap-2 pl-1 pr-3"
              : "w-11 justify-center gap-0"
          }`}
        >
          <input
            type="checkbox"
            checked={!!selected}
            onChange={(e) => onSelectChange(e.target.checked)}
            aria-label={`Seleccionar ${title ?? "producto"}`}
            className="sr-only align-middle"
          />
          {selected ? (
            <IconX className="text-white h-5 w-5 shrink-0" aria-hidden="true" />
          ) : (
            <IconPlus
              className="text-white h-5 w-5 shrink-0"
              aria-hidden="true"
            />
          )}
          <span
            aria-hidden="true"
            className={`whitespace-nowrap text-sm font-medium text-white transition-all duration-200 ease-out ${
              selected ? "max-w-30 opacity-100" : "max-w-0 opacity-0"
            }`}
          >
            {data.ui.selectedLabel}
          </span>
        </label>
      )}

      {hasContent && (
        <div className="flex flex-1 flex-col justify-between p-6">
          {title && (
            <h3 className="mb-2 line-clamp-1 text-2xl font-poppins font-bold text-sc-ocean-blue">
              {title}
            </h3>
          )}

          {description && (
            <p className="line-clamp-2 text-base font-poppins leading-relaxed text-sc-ocean-blue/70">
              {description}
            </p>
          )}
        </div>
      )}
    </article>
  );
};
