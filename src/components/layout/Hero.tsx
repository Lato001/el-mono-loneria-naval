import { Link } from "react-router-dom";
import { PATHS } from "../../routes/routes";

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
    <section
      id="home"
      className="relative overflow-hidden px-8 pt-[110px] pb-[90px] text-white bg-gradient-to-br from-sc-ocean-blue to-pr-hero-blue"
    >
      <div
        className="absolute -top-[120px] -right-[120px] w-[420px] h-[420px] rounded-full bg-pr-aquamarine/20 pointer-events-none select-none"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1180px]">
        <p className="font-poppins text-xs uppercase tracking-[0.2em] text-pr-aquamarine mb-4">
          {eyebrow}
        </p>

        <h1 className="font-poppins font-bold uppercase leading-[1.05] text-[clamp(2.4rem,5.5vw,4.4rem)] max-w-[820px]">
          {titlePrefix}
          <span className="text-pr-aquamarine">{titleHighlight}</span>
        </h1>

        <p className="font-poppins text-[1.15rem] opacity-[0.88] max-w-[560px] mt-6">
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
    </section>
  );
}
