import type { ReactNode } from "react";

export interface ServicesSectionProps {
  children: ReactNode;
  className?: string;
  /** URL of the icon to display (isotipo). Optional. */
  icon?: string;
  /** Small uppercase label above the title. Optional. */
  eyebrow?: string;
  /** Section title. Required. */
  title: string;
}
