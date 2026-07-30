import { data } from "../../../mocks/data";
import type { MarqueeItem } from "./Marquee.types";

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

interface BrandMarqueeProps {
  className?: string;
}

export function BrandMarquee({ className }: BrandMarqueeProps) {
  return (
    <Marquee
      className={` bg-sc-ocean-blue/5 backdrop-blur-xl rounded-r-3xl  border-white/20 shadow-lg shadow-black/5  ${className}`}
      items={brandItems}
      speed={10}
      pauseOnHover={false}
      renderItem={(item) => (
        <div
          className={`mx-10 h-24 w-full opacity-70 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100 `}
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
