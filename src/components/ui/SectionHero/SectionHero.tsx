import { Button } from "../Button";
import type { SectionHeroProps } from "./SectionHero.types";
import monoLogo from "../../../assets/logos/elmono/isotipo-elmono.png";
import defaultImg from "../../../assets/backgrounds/formas-acuarela-01.jpg";
export function SectionHero({
  title,
  description,
  ctaLabel,
  ctaTargetId,
  img,
}: SectionHeroProps) {
  const handleCtaClick = () => {
    if (!ctaTargetId) return;
    document
      .getElementById(ctaTargetId)
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const bgImage = img ?? defaultImg;

  return (
    <section className=" relative overflow-hidden bg-sc-chalk py-20 xl:pt-30  md:py-20 ">
      <img
        data-testid="hero-bg"
        src={bgImage}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 m-auto h-full w-full object-cover"
      />
      <img
        data-testid="hero-logo"
        src={monoLogo}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-2/3 top-[50%] h-[85%] w-auto max-w-none -translate-x-1/2 object-cover object-top"
      />
      <div
        data-testid="hero-content"
        className="relative z-10 mx-auto max-w-295 px-6"
      >
        <h1 className="font-poppins mb-6 font-bold uppercase text-[clamp(1.8rem,3.5vw,2.8rem)] text-sc-ocean-blue">
          {title}
        </h1>
        {description && (
          <p className="font-poppins mb-8 max-w-2xl text-base leading-relaxed text-sc-ocean-blue">
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
