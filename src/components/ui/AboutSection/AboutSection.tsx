import { Button } from "../Button";
import type { AboutSectionProps } from "./AboutSection.types";

function handleImageError(e: React.SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.style.display = "none";
}

export function AboutSection({
  image,
  imageAlt,
  content,
  highlights,
  cta,
  eyebrow = "Sobre nosotros",
  title = "Pasión por el oficio",
}: AboutSectionProps) {
  return (
    <section className="bg-sc-chalk px-6 py-20">
      <div className="mx-auto max-w-295">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left col: Image or placeholder */}
          <div className="overflow-hidden rounded-2xl bg-sc-sand/30 shadow-xl aspect-4/3">
            {image ? (
              <img
                src={image}
                alt={imageAlt ?? ""}
                className="h-full w-full object-cover"
                onError={handleImageError}
              />
            ) : (
              /* TODO: replace with real image when available */
              <div className="flex h-full w-full items-center justify-center">
                <p className="font-poppins text-sm text-sc-ocean-blue/40">
                  Imagen pendiente
                </p>
              </div>
            )}
          </div>

          {/* Right col: Content */}
          <div className="flex flex-col gap-6">
            <p className="font-poppins text-xs uppercase tracking-[0.2em] text-pr-hero-blue">
              {eyebrow}
            </p>
            <h2 className="font-poppins font-bold uppercase leading-[1.05] text-[clamp(1.8rem,3.5vw,2.8rem)] text-sc-ocean-blue">
              {title}
            </h2>

            <div className="space-y-4">
              {content.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-base leading-relaxed text-sc-ocean-blue/80"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {highlights && highlights.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {highlights.map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center text-center"
                  >
                    <span className="font-poppins text-2xl font-bold text-sc-ocean-blue">
                      {value}
                    </span>
                    <span className="font-poppins text-xs uppercase tracking-wider text-sc-ocean-blue/60">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {cta && (
              <div className="mt-2">
                <Button variant="primary" href={cta.href}>
                  {cta.text}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
