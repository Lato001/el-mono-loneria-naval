import { Button } from "../Button";
import { ImgCard } from "../Card";
import aboutImg1 from "../../../assets/img/services/services-01.jpg";
import aboutImg2 from "../../../assets/img/services/services-02.jpg";
import aboutImg3 from "../../../assets/img/services/services-04.jpg";
import aboutImg4 from "../../../assets/img/services/services-05.jpg";
import type { AboutSectionProps } from "./AboutSection.types";

// TODO: move out of the component when real workshop gallery is available
const defaultImages = [
  { src: aboutImg1, alt: "Trabajo de lonería en taller" },
  { src: aboutImg2, alt: "Lona terminada" },
  { src: aboutImg3, alt: "Detalle de confección" },
  { src: aboutImg4, alt: "Proyecto entregado" },
];

// TODO: move out of the component when real workshop stats are finalized
const defaultHighlights = [
  { value: "+20", label: "Años en el rubro" },
  { value: "+200", label: "Proyectos terminados" },
  { value: "24hs", label: "Presupuestos" },
];

function handleImageError(e: React.SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.style.display = "none";
}

export function AboutSection({
  image,
  imageAlt,
  images = defaultImages,
  showControls = false,
  interval = 4000,
  content,
  description,
  highlights = defaultHighlights,
  cta,
  eyebrow,
  title,
}: AboutSectionProps) {
  const hasGallery = !!images && images.length > 0;
  const hasImage = !!image;
  const copy: string[] = Array.isArray(content)
    ? content
    : description
      ? [description]
      : [];

  return (
    <div className="grid grid-cols-1 items-center gap-12">
      {/* Top: gallery, static image, or placeholder (centered, capped width) */}
      {hasGallery ? (
        <div className="mx-auto w-full max-w-3xl">
          <ImgCard
            images={images}
            interval={interval}
            showControls={showControls}
            className="max-w-none aspect-4/3 w-full"
          />
        </div>
      ) : (
        <div className="mx-auto aspect-4/3 w-full max-w-3xl overflow-hidden rounded-2xl bg-sc-sand/30 shadow-xl">
          {hasImage ? (
            <img
              src={image}
              alt={imageAlt ?? ""}
              className="h-full w-full object-cover"
              onError={handleImageError}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <p className="font-poppins text-sm text-sc-ocean-blue/40">
                Imagen pendiente
              </p>
            </div>
          )}
        </div>
      )}

      {/* Bottom: copy + trust indicators + CTA (centered, capped width) */}
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 text-center">
        {eyebrow && (
          <p className="font-poppins text-sm uppercase tracking-[0.2em] text-pr-hero-blue">
            {eyebrow}
          </p>
        )}
        {title && (
          <h2 className="font-poppins font-bold uppercase leading-[1.05] text-[clamp(2.2rem,4.5vw,3.6rem)] text-sc-ocean-blue">
            {title}
          </h2>
        )}

        {copy.length > 0 && (
          <div className="space-y-4">
            {copy.map((paragraph, index) => (
              <p
                key={index}
                className="font-poppins font-medium text-lg leading-relaxed text-sc-ocean-blue/80"
              >
                {paragraph}
              </p>
            ))}
          </div>
        )}

        {highlights && highlights.length > 0 && (
          <div className="mt-2 grid grid-cols-3 gap-4 border-t border-sc-ocean-blue/10 pt-6">
            {highlights.map(({ label, value }) => (
              <div
                key={label}
                className="flex flex-col items-center text-center"
              >
                <span className="font-poppins text-4xl font-bold text-pr-hero-blue">
                  {value}
                </span>
                <span className="mt-1 font-poppins text-sm uppercase tracking-wider text-sc-ocean-blue/60">
                  {label}
                </span>
              </div>
            ))}
          </div>
        )}

        {cta && (
          <div className="mt-2 flex justify-center">
            <Button variant="hero" href={cta.href}>
              {cta.text}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
