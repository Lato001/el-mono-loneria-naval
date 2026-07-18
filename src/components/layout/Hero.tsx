import { Link } from "react-router-dom";
import { PATHS } from "../../routes/routes";
import bgOlas from "../../assets/backgrounds/formas-olas-sec.svg";
import { BrandMarquee, ImgCard } from "../ui";

interface HeroProps {
  eyebrow?: string;
  titlePrefix?: string;
  titleHighlight?: string;
  description?: string;
  primaryCta?: string;
  secondaryCta?: string;
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
              <Link
                to={import.meta.env.VITE_WHATSAPP_URL}
                className="inline-block rounded-lg bg-white px-6 py-3 font-poppins font-bold text-[clamp(1rem,1.5vw,1.1rem)] text-pr-hero-blue border border-white transition-colors hover:border-pr-aquamarine md:px-8 md:py-3.5"
              >
                {primaryCta}
              </Link>
              <Link
                to={PATHS.PRODUCTS}
                className="inline-block rounded-lg bg-transparent px-6 py-3 font-poppins font-bold text-[clamp(1rem,1.5vw,1.1rem)] text-white border border-white/40 transition-colors hover:border-white md:px-8 md:py-3.5"
              >
                {secondaryCta}
              </Link>
            </div>
          </div>
          <ImgCard className="max-lg:hidden" images={images} interval={4000} />
        </div>
      </section>
      <BrandMarquee className="bg-linear-to-br from-pr-hero-blue to-sc-ocean-blue" />
    </>
  );
}
