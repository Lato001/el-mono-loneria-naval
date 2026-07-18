import { Button } from "../Button";
import type { SectionHeroProps } from "./SectionHero.types";
import bgOlas from "../../../assets/backgrounds/formas-canales.svg";
export function SectionHero({
  img = bgOlas,
  title,
  description,
  ctaLabel,
  ctaTargetId,
}: SectionHeroProps) {
  const handleCtaClick = () => {
    if (!ctaTargetId) return;
    document
      .getElementById(ctaTargetId)
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="bg-white py-10 md:py-20 text-sc-ocean-blue"
      style={{
        backgroundImage: `url(${img})`,
        backgroundSize: "cover",
        backgroundPosition: "center bottom",
      }}
    >
      <div className="mx-auto max-w-295 px-6">
        <h1 className="font-poppins mb-6 font-bold uppercase text-[clamp(1.8rem,3.5vw,2.8rem)] text-sc-ocean-blue">
          {title}
        </h1>
        {description && (
          <p className="font-poppins mb-8 max-w-2xl text-base leading-relaxed text-sc-ocean-blue/70">
            {description}
          </p>
        )}
        {ctaLabel && (
          <Button variant="hero" onClick={handleCtaClick}>
            {ctaLabel}
          </Button>
        )}
      </div>
    </section>
  );
}
