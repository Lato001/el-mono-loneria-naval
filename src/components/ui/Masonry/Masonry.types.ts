import type { ReactNode } from "react";

export interface Item {
  id: string;
  img: string;
  url?: string;
  alt?: string;
  title?: string;
  redirectUrl?: string;
  /** ID of the trabajo this image belongs to — enables click→showcase navigation */
  trabajoId?: string;
  /** Category slug — enables filtering and hash sync */
  categoria?: string;
  /** Optional card eyebrow shown above the title (Home mosaic presentation). */
  eyebrow?: string;
  /** Optional chips shown under the title (Home mosaic presentation). */
  chips?: string[];
}

export interface GridItem extends Item {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface MasonryProps {
  items: Item[];
  /**
   * Build-time image dimensions (resolved URL → { w, h }). When provided, the
   * uniform packing uses real aspect ratios without downloading the images;
   * missing URLs fall back to a 4/3 ratio. Optional — Home's mosaic variant
   * ignores aspect ratios (fixed row height).
   */
  imageDims?: Record<string, { w: number; h: number }>;
  variant?: "uniform" | "mosaic";
  ease?: string;
  duration?: number;
  stagger?: number;
  scaleOnHover?: boolean;
  hoverScale?: number;
  blurToFocus?: boolean;
  colorShiftOnHover?: boolean;
  /** Optional click handler — when provided, clicking an item calls this instead of opening the internal Modal */
  onItemClick?: (item: Item, index: number) => void;
  /**
   * Optional footer rendered inside the grid container, after the cells (e.g.
   * a "Cargar más" button). Flows below the grid.
   */
  footer?: ReactNode;
}
