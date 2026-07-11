import sauledaSrc from "../../../assets/logos/brands/sauleda-logo.svg";
import sunbrellaSrc from "../../../assets/logos/brands/sunbrella-logo.svg";
import achillesSrc from "../../../assets/logos/brands/achilles-logo.svg";
import coatsSrc from "../../../assets/logos/brands/coats-logo.svg";
import ykkSrc from "../../../assets/logos/brands/ykk-logo.svg";

import { Marquee } from "./";

interface BrandMarqueeProps {
  className?: string;
}
export function BrandMarquee({ className }: BrandMarqueeProps) {
  const BRANDS = [
    {
      id: "sauleda",
      src: sauledaSrc,
      alt: "Sauleda",
      link: "https://sauleda.com/",
    },
    {
      id: "ykk",
      src: ykkSrc,
      alt: "YKK",
      link: "https://argentina.ykkamericas.com/",
    },
    {
      id: "sunbrella",
      src: sunbrellaSrc,
      alt: "Sunbrella",
      link: "https://global.sunbrella.com",
    },
    {
      id: "coats",
      src: coatsSrc,
      alt: "Coats",
      link: "https://www.coats.com/",
    },
    { id: "achilles", src: achillesSrc, alt: "Achilles" },
  ];
  return (
    <Marquee
      className={`${className}`}
      items={BRANDS}
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
