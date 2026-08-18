import type { ReactNode } from "react";

export interface ImgCardProps {
  src?: string;
  alt?: string;
  images?: { src: string; alt: string }[];
  interval?: number;
  className?: string;
  title?: string;
  imageClassName?: string;
  showControls?: boolean;
  actionButton?: ReactNode;
  overlay?: ReactNode;
  /**
   * Loading strategy for the single-image render. Defaults to "lazy" because
   * most single-image usages (FAQ bubbles, split cards) sit below the fold.
   * Above-the-fold consumers (the Works showcase) pass "eager".
   */
  loading?: "lazy" | "eager";
}
