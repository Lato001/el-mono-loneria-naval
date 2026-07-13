export interface Highlight {
  label: string;
  value: string;
}

export interface AboutCta {
  text: string;
  href: string;
}

export interface AboutSectionImage {
  src: string;
  alt: string;
}

export interface AboutSectionProps {
  /** Single static image (mutually exclusive with `images`). */
  image?: string;
  /** Alt text for the static `image`. */
  imageAlt?: string;
  /** Gallery of images (mutually exclusive with `image`). */
  images?: AboutSectionImage[];
  /** Show left/right manual controls on the gallery. */
  showControls?: boolean;
  /** Auto-advance interval in ms (default 4000). */
  interval?: number;

  /** Multiple paragraphs (mutually exclusive with `description`). */
  content?: string[];
  /** Single short paragraph (mutually exclusive with `content`). */
  description?: string;

  /** Trust indicators / stats rendered under the copy. */
  highlights?: Highlight[];
  /** Optional CTA button at the bottom. */
  cta?: AboutCta;

  /** Small uppercase label above the title. */
  eyebrow?: string;
  /** Section title. */
  title?: string;
}
