import { Link } from "react-router-dom";
import { PATHS } from "../../routes/routes";
import bgOlas from "../../assets/backgrounds/formas-olas-sec.svg";
import heroImg1 from "../../assets/img/services/services-01.jpg";
import heroImg2 from "../../assets/img/services/services-02.jpg";
import heroImg3 from "../../assets/img/services/services-04.jpg";
import heroImg4 from "../../assets/img/services/services-05.jpg";
import { BrandMarquee, ImgCard } from "../ui";

interface HeroProps {
  eyebrow?: string;
  titlePrefix?: string;
  titleHighlight?: string;
  description?: string;
  primaryCta?: string;
  secondaryCta?: string;
}

export function Hero({
  eyebrow = "Lonería naval — a medida, para cada superficie",
  titlePrefix = "Lonas, capotas y fundas que ",
  titleHighlight = "resisten cualquier intemperie",
  description = "Confección de lonas, cerramientos, capotas, cubreautos y fundas para motos de agua. Trabajo a medida con materiales técnicos de alta durabilidad.",
  primaryCta = "Solicitar presupuesto",
  secondaryCta = "Ver servicios",
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

            <p className="font-poppins text-[1.15rem] opacity-[0.88] max-w-140 mt-6">
              {description}
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                to={PATHS.CONTACT}
                className="inline-block rounded-lg bg-white px-8 py-3 font-poppins font-bold text-[1.1rem] text-pr-hero-blue border border-white transition-colors hover:border-pr-aquamarine"
              >
                {primaryCta}
              </Link>
              <Link
                to={PATHS.SERVICES}
                className="inline-block rounded-lg bg-transparent px-8 py-3 font-poppins font-bold text-[1.1rem] text-white border border-white/40 transition-colors hover:border-white"
              >
                {secondaryCta}
              </Link>
            </div>
          </div>
          <ImgCard
            className="max-[1000px]:hidden"
            images={[
              { src: heroImg1, alt: "Lona naval" },
              { src: heroImg2, alt: "Capota a medida" },
              { src: heroImg3, alt: "Cubreauto" },
              { src: heroImg4, alt: "Funda para moto de agua" },
            ]}
            interval={4000}
          />
        </div>
      </section>
      <BrandMarquee className="bg-linear-to-br from-pr-hero-blue to-sc-ocean-blue" />
    </>
  );
}
