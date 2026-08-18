export interface HeroProps {
  eyebrow?: string;
  titlePrefix?: string;
  titleHighlight?: string;
  description?: string;
  primaryCta: string;
  secondaryCta: string;
  videos?: { src: string; srcFallback: string; poster: string; alt: string }[];
}
