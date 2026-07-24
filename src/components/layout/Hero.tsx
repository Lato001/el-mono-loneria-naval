import bgOlas from "../../assets/backgrounds/formas-olas-sec.svg";
import { PATHS } from "../../routes/routes";
import { BrandMarquee, ImgCard } from "../ui";
import { LinkButton } from "../ui/Button/";

interface HeroProps {
  eyebrow?: string;
  titlePrefix?: string;
  titleHighlight?: string;
  description?: string;
  primaryCta: string;
  secondaryCta: string;
  images?: { src: string; alt: string }[];
}

export function Hero({
  eyebrow,
  titlePrefix,
  titleHighlight,
  description,
  primaryCta,
  secondaryCta,
  images,
}: HeroProps) {
  return (
    <>
      <section
        id="home"
        className="relative overflow-hidden px-8 pt-27.5 pb-20 text-white bg-linear-to-br from-sc-ocean-blue to-pr-hero-blue"
      >
        <div
          className="absolute -top-30 -right-30 w-105 h-105 rounded-full bg-pr-aquamarine/20 pointer-events-none select-none"
          aria-hidden="true"
        />

        <div
          className="absolute inset-0 pointer-events-none select-none"
          aria-hidden="true"
          style={{
            backgroundImage: `url(${bgOlas})`,
            backgroundSize: "cover",
            backgroundPosition: "center bottom",
            opacity: 0.4,
          }}
        />
        <div className="relative z-10 flex items-center justify-around gap-8 mx-[clamp(1rem,10vw,12.5rem)]">
          <div className="relative max-w-150">
            <p className="font-poppins text-xs uppercase tracking-[0.2em] text-pr-aquamarine mb-4">
              {eyebrow}
            </p>

            <h1 className="font-poppins font-bold uppercase leading-[1.05] text-[clamp(2.4rem,5.5vw,4.4rem)] max-w-205">
              {titlePrefix}
              <span className="text-pr-aquamarine">{titleHighlight}</span>
            </h1>

            <p className="font-poppins text-[clamp(1rem,2.5vw,1.15rem)] opacity-[0.88] max-w-140 mt-6">
              {description}
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <LinkButton type="Contact" text={primaryCta}></LinkButton>
              <LinkButton
                type="Redirect"
                text={secondaryCta}
                path={PATHS.PRODUCTS}
              ></LinkButton>
            </div>
          </div>
          <ImgCard className="max-lg:hidden" images={images} interval={4000} />
        </div>
      </section>
      <BrandMarquee className="bg-linear-to-br from-pr-hero-blue to-sc-ocean-blue" />
    </>
  );
}
