import type { RotatingCardProps } from "./RotatingCard.types";

/**
 * RotatingCard — renders a responsive grid of service items as cards.
 * Each item is an <article> with a heading and description.
 */
export function RotatingCard({ items, className }: RotatingCardProps) {
  return (
    <div
      className={`grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 ${className ?? ""}`}
    >
      {items.map((item) => (
        <article
          key={item.id}
          className="flex flex-col overflow-hidden rounded-xl border-2 border-sc-ocean-blue/15 bg-white transition-all duration-200 ease-out hover:-translate-y-1.5 hover:shadow-xl"
        >
          {item.color && (
            <div
              className="h-32 w-full shrink-0"
              style={{ backgroundColor: item.color }}
              aria-hidden="true"
            />
          )}
          <div className="flex flex-1 flex-col justify-between p-6">
            <h3 className="mb-2 line-clamp-1 text-xl font-poppins font-bold text-sc-ocean-blue">
              {item.title}
            </h3>
            <p className="line-clamp-3 text-sm font-poppins leading-relaxed text-sc-ocean-blue/70">
              {item.description}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
