import { ImgCard } from "../Card";
import type { SplitCardData } from "../../../mocks/types";

interface SplitCardsProps {
  items: SplitCardData[];
  imageMap: Record<string, string>;
}

export function SplitCards({ items, imageMap }: SplitCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {items.map((c) => (
        <a href={`${c.title}`} key={c.title} className="group block w-3/4 md:w-full mx-auto">
          <ImgCard
            className="w-full max-w-md aspect-4/3 border-transparent transition-all duration-400 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:border-pr-aquamarine hover:ring-2 hover:ring-pr-aquamarine"
            imageClassName="brightness-50 grayscale-50 transition-all duration-600 ease-out group-hover:brightness-100 group-hover:grayscale-0 group-hover:scale-105"
            src={imageMap[c.imageKey]}
            alt={c.title}
            title={c.title}
          />
        </a>
      ))}
    </div>
  );
}
