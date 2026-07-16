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
  const hasContent = !!(title || description);
  const hasImage = !!(imageSrc || color);
  const isInteractive = !!onSelectChange;

  return (
    <article
      className={`relative h-120 flex flex-col overflow-hidden rounded-xl border-2 group transition-all duration-200 ease-out hover:-translate-y-1.5 hover:shadow-xl
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

      {isInteractive && (
        <label
          className={`absolute top-3 right-3 z-20 inline-flex h-8 items-center gap-2 overflow-hidden rounded-full border-2 bg-white/90 pl-1 pr-1 backdrop-blur-sm transition-all duration-200 ease-out cursor-pointer
            ${selected ? "border-sc-ocean-blue pr-3" : "border-transparent"}`}
        >
          <input
            type="checkbox"
            checked={!!selected}
            onChange={(e) => onSelectChange(e.target.checked)}
            aria-label={`Seleccionar ${title ?? "producto"}`}
            className="h-4 w-4 shrink-0 cursor-pointer accent-pr-aquamarine"
          />
          <span
            aria-hidden="true"
            className={`whitespace-nowrap text-sm font-medium transition-all duration-200 ease-out ${
              selected
                ? "max-w-[7.5rem] text-sc-ocean-blue opacity-100"
                : "max-w-0 opacity-0"
            }`}
          >
            Seleccionado
          </span>
        </label>
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
        </div>
      )}
    </article>
  );
};
