export interface CardProps {
  title?: string;
  description?: string;
  badge?: string;
  imageSrc?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  className?: string;
  color?: string;
  badgeClassName?: string;
}

export const Card = ({
  title,
  description,
  badge,
  imageSrc,
  ctaLabel,
  onCtaClick,
  className,
  color = "#F4F4F4",
  badgeClassName = "bg-pr-aquamarine/80",
}: CardProps) => {
  const hasContent = !!(title || description || ctaLabel);
  const hasImage = !!(imageSrc || color);

  return (
    <article
      className={`h-120 flex flex-col overflow-hidden rounded-xl border-2 border-sc-ocean-blue/15 bg-white group transition-all duration-200 ease-out hover:-translate-y-1.5 hover:shadow-xl ${className ?? ""}`}
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
            <h3 className="mb-2 text-2xl font-poppins font-bold  text-sc-ocean-blue ">
              {title}
            </h3>
          )}

          {description && (
            <p className="text-base font-poppins leading-relaxed text-sc-ocean-blue/70">
              {description}
            </p>
          )}

          {ctaLabel && (
            <button
              type="button"
              onClick={onCtaClick}
              aria-label={ctaLabel}
              className="mt-auto w-full rounded-full cursor-pointer  bg-sc-ocean-blue px-5 py-2.5 text-sm font-medium text-sc-chalk transition-colors duration-150 hover:bg-sc-sky-blue"
            >
              {ctaLabel}
            </button>
          )}
        </div>
      )}
    </article>
  );
};
