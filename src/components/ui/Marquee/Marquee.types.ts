import type { ReactNode } from "react";

export interface MarqueeItem {
  id: string;
  src: string;
  alt: string;
  name?: string;
  link?: string;
}

export interface MarqueeProps {
  items: MarqueeItem[];
  renderItem?: (item: MarqueeItem, index: number) => ReactNode;
  speed?: number;
  pauseOnHover?: boolean;
  direction?: "left" | "right";
  className?: string;
}
