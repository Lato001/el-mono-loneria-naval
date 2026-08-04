import type { RefObject } from "react";

export interface Product {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
}

export interface ProductCarouselProps {
  items: Product[];
  ariaLabel: string;
  id: string;
  isSelected?: (id: string) => boolean;
  onToggle?: (id: string) => void;
  scrollRef?: RefObject<HTMLDivElement | null>;
}
