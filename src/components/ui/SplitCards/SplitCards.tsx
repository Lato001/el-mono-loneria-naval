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
        <a href={`${c.title}`} key={c.title}>
          <ImgCard
            className="w-full max-w-md aspect-4/3  "
            imageClassName="brightness-50 grayscale-50 hover:brightness-100 hover:grayscale-0"
            src={imageMap[c.imageKey]}
            alt={c.title}
            title={c.title}
          ></ImgCard>
        </a>
      ))}
    </div>
  );
}
