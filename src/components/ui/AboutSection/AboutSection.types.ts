export interface Highlight {
  label: string;
  value: string;
}

export interface AboutCta {
  text: string;
  href: string;
}

export interface AboutSectionProps {
  image?: string;
  imageAlt?: string;
  content: string[];
  highlights?: Highlight[];
  cta?: AboutCta;
  eyebrow?: string;
  title?: string;
}
