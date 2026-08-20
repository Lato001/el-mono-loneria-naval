import type { ReactNode } from "react";

export interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  /** Optional HTML id, useful for in-page anchors (e.g. scroll-to). */
  id?: string;
  /** Small uppercase label above the title. Optional. */
  eyebrow?: string;
  /** Adds a short 16px dash before the eyebrow text. Optional (default: false). */
  /** Optional right-aligned secondary text under the header. When present the
   *  header becomes a flex row (justify-between items-end) on desktop and
   *  collapses to a column on mobile. */
  subtitle?: string;
  /** Section title. Required. */
  title: string;
  theme?: "dark" | "light";
  titlesAlign?: "start" | "center" | "end";
  /**
   * Optional background image rendered behind the whole section (titles and
   * children). The image is repeated vertically to cover the full section
   * height at viewport width. Use for decorative SVG/texture layers.
   */
  backgroundImage?: string;
  /**
   * Heading level for the section title.
   * - "h1": page-level heading. Use when the page has no other top-level heading (e.g. /faq, /nosotros, /contacto, /servicios).
   * - "h2": section heading. Use inside composite pages like Home that already have an h1 hero.
   * Default: "h2".
   */
  headingLevel?: "h1" | "h2" | "h3";
  /** If true, removes max-w and px constraints for full-width children. */
  fullWidth?: boolean;
  /**
   * Overrides the inner container classes when NOT fullWidth.
   * Default: "mx-auto max-w-295 px-6". Useful for widening a specific section
   * (e.g. a showcase with long text) without touching other sections.
   */
  containerClassName?: string;
}
