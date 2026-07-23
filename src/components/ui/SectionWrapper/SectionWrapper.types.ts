import type { ReactNode } from "react";

export interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  /** Optional HTML id, useful for in-page anchors (e.g. scroll-to). */
  id?: string;
  /** Small uppercase label above the title. Optional. */
  eyebrow?: string;
  /** Section title. Required. */
  title: string;
  theme?: "dark" | "light";
  titlesAlign?: "start" | "center" | "end";
  /**
   * Heading level for the section title.
   * - "h1": page-level heading. Use when the page has no other top-level heading (e.g. /faq, /nosotros, /contacto, /servicios).
   * - "h2": section heading. Use inside composite pages like Home that already have an h1 hero.
   * Default: "h2".
   */
  headingLevel?: "h1" | "h2" | "h3";
}
