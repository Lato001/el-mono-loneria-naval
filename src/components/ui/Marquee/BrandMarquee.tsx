import sauledaSrc from "../../../assets/logos/brands/sauleda-logo.svg";
import sunbrellaSrc from "../../../assets/logos/brands/sunbrella-logo.svg";
import achillesSrc from "../../../assets/logos/brands/achilles-logo.svg";
import coatsSrc from "../../../assets/logos/brands/coats-logo.svg";
import ykkSrc from "../../../assets/logos/brands/ykk-logo.svg";
import { data } from "../../../mocks/data";
import type { MarqueeItem } from "./Marquee.types";

import { Marquee } from "./";

const brandImageMap: Record<string, string> = {
  sauleda: sauledaSrc,
  ykk: ykkSrc,
  sunbrella: sunbrellaSrc,
  coats: coatsSrc,
  achilles: achillesSrc,
};

const brandItems: MarqueeItem[] = data.brands.map((b) => ({
  id: b.id,
  src: brandImageMap[b.id],
  alt: b.alt,
  link: b.link,
}));

interface BrandMarqueeProps {
  className?: string;
}
export function BrandMarquee({ className }: BrandMarqueeProps) {
  return (
    <Marquee
      className={`${className}`}
      items={brandItems}
      speed={10}
      pauseOnHover={false}
      renderItem={(item) => (
        <div
          className={`mx-10 h-24 w-full transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100 `}
        >
          <a href={item.link}>
            <img
              src={item.src}
              alt={item.alt}
              className="h-full w-full object-contain scale-75 "
            />
          </a>
        </div>
      )}
    />
  );
}
