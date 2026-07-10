import type { ReactNode } from "react";

export interface HomeSectionProps {
  eyebrow: string;
  title: string;
  icon? : string;
  children?: ReactNode;
  /** When true, eyebrow+title container gets text-center on mobile, text-left at md:. Default: false. */
  centerTitleOnMobile?: boolean;
}
