export interface CardProps {
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
  const hasContent = !!(title || description || onSelectChange);
  const hasImage = !!(imageSrc || color);
  const isInteractive = !!onSelectChange;

  return (
    <article
      className={`h-120 flex flex-col overflow-hidden rounded-xl border-2 group transition-all duration-200 ease-out hover:-translate-y-1.5 hover:shadow-xl
      ${selected ? "border-pr-aquamarine ring-2 ring-pr-aquamarine" : "border-sc-ocean-blue/15 bg-white"}
      ${className ?? ""}`}
    >
      {hasImage && (
        <div className="relative h-64 shrink-0 overflow-hidden">
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

      {hasContent && (
        <div className="flex flex-1 flex-col justify-between p-6">
          {title && (
            <h3 className="mb-2 text-2xl font-poppins font-bold text-sc-ocean-blue">
              {title}
            </h3>
          )}

          {description && (
            <p className="text-base font-poppins leading-relaxed text-sc-ocean-blue/70">
              {description}
            </p>
          )}

          {isInteractive && (
            <label className="mt-auto flex cursor-pointer items-center gap-2 rounded-full bg-sc-chalk px-5 py-2.5 text-sm font-medium text-sc-ocean-blue transition-colors hover:bg-sc-chalk/70 focus-within:ring-2 focus-within:ring-pr-aquamarine">
              <input
                type="checkbox"
                checked={!!selected}
                onChange={(e) => onSelectChange(e.target.checked)}
                aria-label={`Seleccionar ${title ?? "producto"}`}
                className="h-4 w-4 cursor-pointer accent-pr-aquamarine"
              />
              <span>{selected ? "Seleccionado" : "Seleccionar"}</span>
            </label>
          )}
        </div>
      )}
    </article>
  );
};
