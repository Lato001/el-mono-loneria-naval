import { useEffect, useMemo, useState } from "react";
import { CategorySelect } from "../CategorySelect";
import { WorksCarousel } from "../WorksCarousel";
import { ImgCard } from "../Card";
import { SectionWrapper } from "../SectionWrapper";
import Masonry, { type Item } from "../Masonry/Masonry";
import type { Categoria, Trabajo } from "../../../types/trabajo";
import { data } from "../../../mocks/data";
import type { AlbumImage } from "../../../mocks/types";
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

export function WorksSection({ imageMap }: WorksSectionProps) {
  const showcaseId = "works-showcase";

  // State
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria>("carpas");
  const [selectedTrabajoId, setSelectedTrabajoId] = useState<string | null>(null);
  const [imageIndex, setImageIndex] = useState(0);

  // Derived values
  const trabajos = data.worksPage.trabajos as Trabajo[];
  const availableCategorias = useMemo(
    () => [...new Set(trabajos.map((t) => t.categoria))].sort(),
    [trabajos],
  );

  const selectedTrabajo = useMemo(
    () =>
      trabajos.find((t) => t.id === selectedTrabajoId) ??
      trabajos.find((t) => t.categoria === selectedCategoria && t.destacado) ??
      trabajos.find((t) => t.categoria === selectedCategoria) ??
      trabajos[0],
    [trabajos, selectedCategoria, selectedTrabajoId],
  );

  // Carousel images: all images of selected trabajo EXCEPT the current big image
  const carouselImages = useMemo(() => {
    if (!selectedTrabajo) return [];
    return selectedTrabajo.imagenes
      .map((img: string, i: number) => ({
        src: imageMap[img],
        alt: `${selectedTrabajo.titulo} - imagen ${i + 1}`,
        originalIndex: i,
      }))
      .filter((_: unknown, i: number) => i !== imageIndex);
  }, [selectedTrabajo, imageIndex, imageMap]);

  // Album items derived from trabajos, shuffled once
  const albumItems = useMemo(() => {
    const items: AlbumImage[] = trabajos.flatMap((t) =>
      t.imagenes.map((img: string, i: number) => ({
        id: `${t.id}-${i}`,
        img: imageMap[img],
        url: "",
        alt: t.titulo,
        title: t.titulo,
        trabajoId: t.id,
        categoria: t.categoria,
      })),
    );
    // Fisher-Yates shuffle for stable random order
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [trabajos, imageMap]);

  // Read hash on mount
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && availableCategorias.includes(hash as Categoria)) {
      const cat = hash as Categoria;
      setSelectedCategoria(cat);
      const firstTrabajo = trabajos.find((t) => t.categoria === cat && t.destacado) ??
        trabajos.find((t) => t.categoria === cat);
      if (firstTrabajo) {
        setSelectedTrabajoId(firstTrabajo.id);
      }
      setImageIndex(0);
    } else {
      // Default to carpas
      const firstCarpas = trabajos.find((t) => t.categoria === "carpas" && t.destacado) ??
        trabajos.find((t) => t.categoria === "carpas");
      if (firstCarpas) {
        setSelectedTrabajoId(firstCarpas.id);
      }
      setImageIndex(0);
    }
  }, []);

  // Write hash on category change + smooth scroll
  const handleCategoriaChange = (categoria: Categoria) => {
    setSelectedCategoria(categoria);
    const firstTrabajo = trabajos.find((t) => t.categoria === categoria && t.destacado) ??
      trabajos.find((t) => t.categoria === categoria);
    if (firstTrabajo) {
      setSelectedTrabajoId(firstTrabajo.id);
    }
    setImageIndex(0);
    history.replaceState(null, "", `#${categoria}`);
    document.getElementById(showcaseId)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAlbumClick = (item: Item, _index: number) => {
    const albumItem = item as AlbumImage;
    if (!albumItem.trabajoId || !albumItem.categoria) return;
    setSelectedCategoria(albumItem.categoria as Categoria);
    setSelectedTrabajoId(albumItem.trabajoId);
    setImageIndex(0);
    history.replaceState(null, "", `#${albumItem.categoria}`);
    document.getElementById(showcaseId)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleThumbSelect = (originalIndex: number) => {
    setImageIndex(originalIndex);
  };

  const mainImageSrc = selectedTrabajo ? imageMap[selectedTrabajo.imagenes[imageIndex]] : "";
  const mainImageAlt = selectedTrabajo ? `${selectedTrabajo.titulo} - imagen principal` : "";

  return (
    <>
      {/* Showcase Section */}
      <SectionWrapper
        id={showcaseId}
        eyebrow="Trabajos"
        title="Nuestros Trabajos"
        theme="dark"
        headingLevel="h1"
      >
        <CategorySelect
          value={selectedCategoria}
          options={availableCategorias}
          onChange={handleCategoriaChange}
        />
        <div className="rounded-3xl bg-gradient-to-r from-sc-ocean-blue/30 to-pr-hero-blue">

        
        <div className="mt-10 grid gap-8 lg:grid-cols-[40%_60%]">
          {/* ImgCard - Left column */}
          <div className="flex justify-center lg:justify-start rounded-3xl">
            <ImgCard
              src={mainImageSrc}
              alt={mainImageAlt}
              imageClassName="w-full max-w-md aspect-[4/3]"
            />
          </div>

          {/* Description - Right column */}
          <div className="flex flex-col justify-start  ">
            <div className="px-8 py-8">

            {selectedTrabajo && (
              <>
                <span className="inline-block self-start rounded-full py-4 font-poppins text-xl font-semibolditalic text-pr-aquamarine ">
                  <div className="flex items-center justify-around">
                  <IconTag stroke={2} className="mr-1.5" />
                  {selectedTrabajo.categoria.charAt(0).toUpperCase() + selectedTrabajo.categoria.slice(1).replace(/-/g, " ")}
                  </div>
                </span>
                <h2 className="my-4 font-poppins font-bold text-2xl text-sc-chalk md:text-3xl">
                  {selectedTrabajo.titulo}
                </h2>
                <p className="mb-6 font-poppins text-base leading-relaxed text-justify text-sc-chalk md:text-lg">
                  {selectedTrabajo.descripcion}
                </p>
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
      titlesAlign="end"
        title="Trabajos destacados"
        theme="dark"
        headingLevel="h2"
      >
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
          onItemClick={handleAlbumClick}
        />
      </SectionWrapper>
    </>
  );
}