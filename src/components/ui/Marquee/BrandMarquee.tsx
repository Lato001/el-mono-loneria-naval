import sauledaSrc from "../../../assets/logos/brands/sauleda-logo.svg";
import sunbrellaSrc from "../../../assets/logos/brands/sunbrella-logo.svg";
import achillesSrc from "../../../assets/logos/brands/achilles-logo.svg";
import coatsSrc from "../../../assets/logos/brands/coats-logo.svg";
import ykkSrc from "../../../assets/logos/brands/ykk-logo.svg";

import { Marquee } from "./";
export function BrandMarquee() {
  const BRANDS = [
    { id: "sauleda", src: sauledaSrc, alt: "Sauleda" },
    { id: "sunbrella", src: sunbrellaSrc, alt: "Sunbrella" },
    { id: "achilles", src: achillesSrc, alt: "Achilles" },
    { id: "coats", src: coatsSrc, alt: "Coats" },
    { id: "ykk", src: ykkSrc, alt: "YKK" },
  ];
  return (
    <Marquee
      items={BRANDS}
      speed={10}
      pauseOnHover={false}
      renderItem={(item) => (
        <div className="mx-10 h-24 w-full grayscale opacity-50 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100">
          <img
            src={item.src}
            alt={item.alt}
            className="h-full w-full object-contain"
          />
        </div>
      )}
    />
  );
}
