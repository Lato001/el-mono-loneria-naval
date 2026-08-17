import { useCallback, useState } from "react";

/**
 * Self-contained inline-SVG fallback used when an <img> fails to load.
 * Data-URI only: no network round-trip, no extra asset in the bundle.
 * On-brand: chalk background with a muted picture glyph in hero blue.
 */
export const IMAGE_FALLBACK_SRC =
  "data:image/svg+xml," +
  encodeURIComponent(
    [
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">',
      '<rect width="400" height="300" fill="#F4F4F4"/>',
      '<g fill="none" stroke="#344784" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" opacity="0.3">',
      '<rect x="128" y="92" width="144" height="116" rx="10"/>',
      '<circle cx="166" cy="126" r="12"/>',
      '<path d="M136 192 L180 150 L212 180 L238 158 L266 192"/>',
      "</g>",
      "</svg>",
    ].join(""),
  );

/**
 * Tracks which image URLs failed to load so a renderer can swap `src` for
 * `IMAGE_FALLBACK_SRC`. `src` returns the Set of failed URLs; `markFailed`
 * records one (idempotent per URL). Used by ImgCard, WorksCarousel and Masonry.
 */
export function useImageFallback() {
  const [failed, setFailed] = useState<Set<string>>(() => new Set());
  const markFailed = useCallback((src: string) => {
    setFailed((prev) => (prev.has(src) ? prev : new Set(prev).add(src)));
  }, []);
  return { failed, markFailed };
}
