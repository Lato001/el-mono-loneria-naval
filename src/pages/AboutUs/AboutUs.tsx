import { ImgCard, SectionWrapper } from "../../components/ui";
import { Button } from "../../components/ui/Button";
import { data } from "../../mocks/data";
import CountUp from "../../components/ui/CountUp/CountUp";

const galleryImages = [
  { src: "", alt: "Primer plano de herramientas de medición" },
  { src: "", alt: "Proceso de corte de tela" },
  { src: "", alt: "Máquina de coser industrial" },
  { src: "", alt: "Resultado final instalado" },
];

export function AboutUs() {
  const about = data.home.aboutUsSection;

  return (
    <SectionWrapper
      eyebrow={about.eyebrow}
      title={about.title}
      theme="light"
      titlesAlign="start"
      headingLevel="h1"
    >
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 text-center">
        {/* Galería de ImgCards */}
        <div className="mx-auto w-full max-w-5xl px-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:gap-4">
            {galleryImages.map(({ alt }) => (
              <ImgCard
                key={alt}
                className="aspect-[3/4] w-full overflow-hidden rounded-lg"
                imageClassName="h-full w-full object-cover"
                src={about.image}
                alt={alt}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="font-poppins font-semibold text-base leading-relaxed text-sc-ocean-blue/80">
            {about.content}
          </p>
        </div>

        {about.highlights && about.highlights.length > 0 && (
          <div className="mt-2 grid grid-cols-3 gap-4 border-t border-sc-ocean-blue/10 pt-6">
            {about.highlights.map(({ label, value }) => (
              <div
                key={label}
                className="flex flex-col items-center text-center font-poppins font-semibold"
              >
                <span className="text-3xl text-sc-sky-blue">
                  <span aria-hidden="true">+</span>
                  <CountUp
                    from={0}
                    to={value}
                    duration={1}
                    direction="up"
                    separator=","
                    delay={0.2}
                  />
                </span>
                <span className="mt-1 text-sm uppercase tracking-wider text-sc-ocean-blue/60">
                  {label}
                </span>
              </div>
            ))}
          </div>
        )}

        {about.cta && (
          <div className="mt-2 flex justify-center">
            <Button variant="primary" href={about.cta.href}>
              {about.cta.text}
            </Button>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}