import { ImgCard } from "../Card";
import type { SplitCardData } from "../../../mocks/types";

interface SplitCardsProps {
  items: SplitCardData[];
  imageMap: Record<string, string>;
}

/**
 * Per-card visual copy (eyebrow + 1-2 chips).
 * PLACEHOLDER TEXT — the user will supply the real chip texts per card.
 * Only presentation; splitCard data structure stays untouched.
 */
const CARD_COPY: Record<string, { eyebrow: string; chips: string[] }> = {
  Productos: {
    eyebrow: "Catálogo",
    chips: ["Lona reforzada", "Varios colores"],
  },
  Trabajos: {
    eyebrow: "Portfolio",
    chips: ["A medida", "Materiales premium"],
  },
};

export function SplitCards({ items, imageMap }: SplitCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {items.map((c) => {
        const copy = CARD_COPY[c.title];
        return (
          <a
            href={`${c.title}`}
            key={c.title}
            className="group block w-full"
          >
            <ImgCard
              className="w-full max-w-md md:max-w-none aspect-[7/4] rounded-3xl border border-transparent transition-all duration-300 ease-out motion-safe:hover:-translate-y-1 hover:ring-1 hover:ring-pr-aquamarine/50"
              imageClassName="brightness-50 grayscale-50 transition-all duration-500 ease-out motion-safe:group-hover:scale-105 group-hover:brightness-100 group-hover:grayscale-0"
              src={imageMap[c.imageKey]}
              alt={c.title}
              overlay={
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  {copy && (
                    <p className="font-poppins text-xs uppercase tracking-[0.2em] text-pr-aquamarine">
                      {copy.eyebrow}
                    </p>
                  )}
                  <h2 className="mt-1 font-brown uppercase tracking-wider text-white text-2xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)]">
                    {c.title}
                  </h2>
                  {copy && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {copy.chips.map((chip) => (
                        <span
                          key={chip}
                          className="rounded-full border border-pr-aquamarine/30 bg-pr-aquamarine/10 px-3 py-1 font-poppins text-xs font-medium text-pr-aquamarine backdrop-blur"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              }
            />
          </a>
        );
      })}
    </div>
  );
}
