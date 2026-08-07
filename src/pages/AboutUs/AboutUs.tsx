import { SectionWrapper } from "../../components/ui";
import { Button } from "../../components/ui/Button";
import { data } from "../../mocks/data";

export function AboutUs() {
  const about = data.home.aboutUsSection;

  return (
    <SectionWrapper
      eyebrow="Sobre Nosotros"
      title={about.title}
      theme="light"
      titlesAlign="start"
      headingLevel="h1"
    >
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 text-center">
        <div className="mx-auto aspect-video w-full max-w-3xl overflow-hidden rounded-2xl bg-sc-sand/30 shadow-xl">
          <img
            src={about.image}
            alt={about.imageAlt}
            className="h-full w-full object-cover"
          />
        </div>

        {about.content.length > 0 && (
          <div className="space-y-4">
            {about.content.map((paragraph, index) => (
              <p
                key={index}
                className="font-poppins font-medium text-lg leading-relaxed text-sc-ocean-blue/80"
              >
                {paragraph}
              </p>
            ))}
          </div>
        )}

        {about.highlights && about.highlights.length > 0 && (
          <div className="mt-2 grid grid-cols-3 gap-4 border-t border-sc-ocean-blue/10 pt-6">
            {about.highlights.map(({ label, value }) => (
              <div
                key={label}
                className="flex flex-col items-center text-center"
              >
                <span className="font-poppins text-4xl font-semibold text-pr-hero-blue">
                  {value}
                </span>
                <span className="mt-1 font-poppins text-sm uppercase tracking-wider text-sc-ocean-blue/60">
                  {label}
                </span>
              </div>
            ))}
          </div>
        )}

        {about.cta && (
          <div className="mt-2 flex justify-center">
            <Button variant="hero" href={about.cta.href}>
              {about.cta.text}
            </Button>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
