import { useEffect, useMemo, useState } from "react";
import { CategorySelect } from "../CategorySelect";
import { WorksCarousel } from "../WorksCarousel";
import { ImgCard } from "../Card";
import { SectionWrapper } from "../SectionWrapper";
import Masonry from "../Masonry/Masonry";
import type { Trabajo } from "../../../types/trabajo";
import { data } from "../../../mocks/data";
import type { AlbumImage } from "../../../mocks/types";
import { useWorksUrlState } from "./useWorksUrlState";
import {
  IconAnchor,
  IconBolt,
  IconDroplet,
  IconLifebuoy,
  IconLock,
  IconPackage,
  IconReplace,
  IconSailboat,
  IconShield,
  IconShieldCheck,
  IconSun,
  IconTag,
  IconTool,
  IconUmbrella,
  IconWind,
} from '@tabler/icons-react';
import type { Icon } from '@tabler/icons-react';

// Icon key (from data.ts `cualidades[].icono`) → Tabler icon component.
// Unknown keys fall back to IconTag.
const cualidadIconos: Record<string, Icon> = {
  IconAnchor,
  IconBolt,
  IconDroplet,
  IconLifebuoy,
  IconLock,
  IconPackage,
  IconReplace,
  IconSailboat,
  IconShield,
  IconShieldCheck,
  IconSun,
  IconTool,
  IconUmbrella,
  IconWind,
};
interface WorksSectionProps {
  imageMap: Record<string, string>;
}

/** Summary length (words) for the mobile "Leer Más" toggle. */
const MOBILE_DESCRIPTION_SUMMARY_WORDS = 30;

/** Live viewport check for mobile (<1024px) using matchMedia. */
function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() => !window.matchMedia("(min-width: 1024px)").matches);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsMobile(!mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return isMobile;
}

/** Truncates a text to the first `maxWords` words. */
function truncateToWords(text: string, maxWords: number): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text.trim();
  return `${words.slice(0, maxWords).join(" ")}...`;
}

interface DescriptionTextProps {
  text: string;
  trabajoId: string;
}

/**
 * Mobile: shows a 60-word summary with a "Leer Más" button when the text is
 * longer. Desktop always shows the full text (side-by-side layout).
 */
function DescriptionText({ text, trabajoId }: DescriptionTextProps) {
  const isMobile = useIsMobile();
  const [expandedTrabajoId, setExpandedTrabajoId] = useState<string | null>(null);
  const isExpanded = expandedTrabajoId === trabajoId;
  const needsToggle = isMobile && text.trim().split(/\s+/).length > MOBILE_DESCRIPTION_SUMMARY_WORDS;

  if (!needsToggle || isExpanded) {
    return (
      <p className="mb-6 max-w-[95%] wrap-anywhere font-poppins text-base leading-relaxed text-justify text-sc-chalk md:text-lg">
        {text}
      </p>
    );
  }

  return (
    <>
      <p className="mb-6 max-w-[95%] wrap-anywhere font-poppins text-base leading-relaxed text-justify text-sc-chalk md:text-lg">
        {truncateToWords(text, MOBILE_DESCRIPTION_SUMMARY_WORDS)}
      </p>
      <button
        type="button"
        onClick={() => setExpandedTrabajoId(trabajoId)}
        className="mb-6 cursor-pointer font-poppins text-base font-semibold text-pr-aquamarine hover:underline focus-visible:outline-2 focus-visible:outline-pr-aquamarine"
      >
        Leer Más
      </button>
    </>
  );
}

export function WorksSection({ imageMap }: WorksSectionProps) {
  const showcaseId = "works-showcase";
  // Scroll target: the content grid (ImgCard + description), not the section top
  // — avoids landing too high and forcing the user to scroll back down a bit.
  const scrollTargetId = "works-showcase-content";

  const trabajos = data.worksPage.trabajos as Trabajo[];
  const availableCategorias = useMemo(
    () => [...new Set(trabajos.map((t) => t.categoria))].sort(),
    [trabajos],
  );

  const {
    selectedCategoria,
    selectedTrabajo,
    carouselImages,
    mainImageSrc,
    mainImageAlt,
    handleCategoriaChange,
    handleAlbumClick,
    handleThumbSelect,
  } = useWorksUrlState({ trabajos, availableCategorias, scrollTargetId, imageMap });

  // Album items derived from trabajos, shuffled once at mount (lazy initializer —
  // keeps Math.random() out of the render path for React Compiler purity).
  const [albumItems] = useState<AlbumImage[]>(() => {
    const items: AlbumImage[] = trabajos.flatMap((t) =>
      t.imagenes.map((img: string, i: number) => ({
        id: `${t.id}-${i}`,
        img: imageMap[img],
        url: "",
        alt: t.titulo,
        title: t.titulo,
        trabajoId: t.id,
        categoria: t.categoria,
        imageIndex: i,
      })),
    );
    // Fisher-Yates shuffle for stable random order
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  });

  return (
    <>
      {/* Showcase Section */}
<SectionWrapper
        id={showcaseId}
        eyebrow="Trabajos"
        title="Nuestros Trabajos"
        theme="dark"
        headingLevel="h1"
        containerClassName="mx-auto max-w-[1400px] px-6 lg:px-10"
      >
        <CategorySelect
          value={selectedCategoria}
          options={availableCategorias}
          onChange={handleCategoriaChange}
        />
        <div className="rounded-3xl bg-gradient-to-r from-sc-ocean-blue/30 to-pr-hero-blue">

        
        <div className="mt-10 grid gap-8 scroll-mt-24 lg:grid-cols-[40%_60%]" id={scrollTargetId}>
          {/* ImgCard - Left column */}
          <div className="flex min-w-0 items-start justify-center rounded-3xl pl-[5px] pt-[5px] pb-[5px] lg:justify-start">
            <ImgCard
              src={mainImageSrc}
              alt={mainImageAlt}
              imageClassName="w-full max-w-md aspect-[4/3]"
              className="!aspect-[4/3] md:!aspect-[9/16] max-w-[450px] max-h-[350px] md:max-h-[700px]"
            />
          </div>

          {/* Description - Right column */}
          <div className="flex min-w-0 flex-col justify-start">
            <div className="w-full min-w-0 px-8 py-8 lg:px-12">

            {selectedTrabajo && (
              <>
                <span className="inline-block self-start rounded-full py-4 font-poppins text-xl font-semibolditalic text-pr-aquamarine ">
                  <div className="flex items-center justify-around">
                  <IconTag stroke={2} className="mr-1.5" />
                  {selectedTrabajo.categoria.charAt(0).toUpperCase() + selectedTrabajo.categoria.slice(1).replace(/-/g, " ")}
                  </div>
                </span>
                <h2 className="my-4 wrap-anywhere font-poppins font-bold text-2xl text-sc-chalk md:text-3xl">
                  {selectedTrabajo.titulo}
                </h2>
                <DescriptionText text={selectedTrabajo.descripcion} trabajoId={selectedTrabajo.id} />
                {selectedTrabajo.cualidades && selectedTrabajo.cualidades.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {selectedTrabajo.cualidades.map((c) => {
                      const IconCualidad = cualidadIconos[c.icono] ?? IconTag;
                      return (
                        <li
                          key={c.texto}
                          className="inline-flex items-center gap-1.5 rounded-full bg-sc-sky-blue/10 px-3 py-1.5 font-poppins text-sm font-semibold text-pr-aquamarine"
                        >
                          <IconCualidad stroke={2} size={16} aria-hidden="true" />
                          {c.texto}
                        </li>
                      );
                    })}
                  </ul>
                )}
                {/* WorksCarousel */}
        {carouselImages.length >= 2 && (
          <WorksCarousel images={carouselImages} onThumbSelect={handleThumbSelect} />
        )}
              </>
            )}
            </div>
          </div>
        </div>
        </div>
        
      </SectionWrapper>

{/* Album Section */}
      <SectionWrapper
      eyebrow="Album de fotos"
      titlesAlign="center"
        title="Trabajos destacados"
        theme="dark"
        headingLevel="h2"
        fullWidth
        className="!pt-0"
      >
        <div className="mx-auto w-full max-w-[1800px] px-2 lg:px-0 min-[2200px]:max-w-[2200px]">
        <Masonry
          items={albumItems}
          variant="uniform"
          ease="power3.out"
          duration={0.6}
          stagger={0.05}
          animateFrom="bottom"
          scaleOnHover
          hoverScale={0.95}
          colorShiftOnHover={true}
          onItemClick={(item) => handleAlbumClick(item as AlbumImage)}
        />
        </div>
      </SectionWrapper>
    </>
  );
}