import { data } from "../../../mocks/data";
import type { MarqueeItem } from "./Marquee.types";
import type { BrandMarqueeProps } from "./BrandMarquee.types";

import { Marquee } from "./";

// ─── Brand logos (auto-discovered via Vite glob) ───────────────────────
const brandImages = import.meta.glob("../../../assets/logos/brands/*", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const brandImageMap: Record<string, string> = Object.fromEntries(
  Object.entries(brandImages).map(([path, url]) => [
    path
      .split("/")
      .pop()!
      .replace(/\.[^.]+$/, ""),
    url,
  ]),
);

const brandItems: MarqueeItem[] = data.brands.map((b) => ({
  id: b.id,
  src: brandImageMap[b.id],
  alt: b.alt,
  link: b.link,
}));

export function BrandMarquee({ className }: BrandMarqueeProps) {
  return (
    <Marquee
      className={` shadow-lg shadow-black/5  pb-4   ${className}`}
      // 
      items={brandItems}
      speed={10}
      pauseOnHover={false}
      renderItem={(item) => (
        <div
          className={`mx-10 h-24 w-full transition-all duration-300 group-hover:grayscale-0   `}
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
