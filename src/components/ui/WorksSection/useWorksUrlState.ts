import { useEffect, useMemo, useState } from "react";
import type { Categoria, Trabajo } from "../../../types/trabajo";
import type { AlbumImage } from "../../../mocks/types";
import type { WorksCarouselImage } from "../WorksCarousel/WorksCarousel.types";

export interface UseWorksUrlStateOptions {
  trabajos: Trabajo[];
  availableCategorias: Categoria[];
  /** Element id to smooth-scroll into view when navigating via category/album. */
  scrollTargetId: string;
  /** imageKey → resolved URL map (see Works.tsx imageMap). */
  imageMap: Record<string, string>;
}

export interface UseWorksUrlStateResult {
  /** "" means "no filter selected" — the CategorySelect shows its placeholder. */
  selectedCategoria: Categoria | "";
  selectedTrabajoId: string | null;
  imageIndex: number;
  selectedTrabajo: Trabajo | undefined;
  /** Images EXCLUDING the current big image (what WorksCarousel renders). */
  carouselImages: WorksCarouselImage[];
  mainImageSrc: string;
  mainImageAlt: string;
  handleCategoriaChange: (categoria: Categoria) => void;
  handleAlbumClick: (albumItem: AlbumImage) => void;
  handleThumbSelect: (originalIndex: number) => void;
}

interface UrlState {
  selectedCategoria: Categoria | "";
  selectedTrabajoId: string | null;
  imageIndex: number;
  /** URL to rewrite to on mount (invalid-param cleanup or legacy-hash migration). */
  rewriteTo?: string;
}

function findFirstTrabajo(trabajos: Trabajo[], categoria: Categoria): Trabajo | undefined {
  return (
    trabajos.find((t) => t.categoria === categoria && t.destacado) ??
    trabajos.find((t) => t.categoria === categoria)
  );
}

/** Reads `imagen` as an index into `trabajo.imagenes`; out-of-range/NaN clamp to 0. */
function readImagenIndex(params: URLSearchParams, trabajo: Trabajo | undefined): number {
  const raw = params.get("imagen");
  if (raw === null || !trabajo) return 0;
  const parsed = Number(raw);
  if (
    Number.isNaN(parsed) ||
    !Number.isInteger(parsed) ||
    parsed < 0 ||
    parsed >= trabajo.imagenes.length
  ) {
    return 0;
  }
  return parsed;
}

function resolveUrlState(trabajos: Trabajo[], availableCategorias: Categoria[]): UrlState {
  const params = new URLSearchParams(window.location.search);
  const hash = window.location.hash.slice(1);

  const trabajoId = params.get("trabajoId");
  const trabajoById = trabajos.find((t) => t.id === trabajoId);
  if (trabajoById) {
    return {
      selectedCategoria: trabajoById.categoria,
      selectedTrabajoId: trabajoById.id,
      imageIndex: readImagenIndex(params, trabajoById),
      rewriteTo: undefined,
    };
  }

  const categoria = params.get("categoria");
  const isInvalidTrabajoId = trabajoId !== null;

  if (categoria && availableCategorias.includes(categoria as Categoria)) {
    const cat = categoria as Categoria;
    const firstTrabajo = findFirstTrabajo(trabajos, cat);
    return {
      selectedCategoria: cat,
      selectedTrabajoId: firstTrabajo ? firstTrabajo.id : null,
      imageIndex: isInvalidTrabajoId ? 0 : readImagenIndex(params, firstTrabajo),
      // Invalid trabajoId with a valid category: keep the category, drop the bogus id.
      rewriteTo: isInvalidTrabajoId
        ? `?${new URLSearchParams({ categoria: cat }).toString()}`
        : undefined,
    };
  }

  if (!params.toString() && hash && availableCategorias.includes(hash as Categoria)) {
    const cat = hash as Categoria;
    const firstTrabajo = findFirstTrabajo(trabajos, cat);
    return {
      selectedCategoria: cat,
      selectedTrabajoId: firstTrabajo ? firstTrabajo.id : null,
      imageIndex: 0,
      rewriteTo: `?${new URLSearchParams({ categoria: cat }).toString()}`,
    };
  }

  const firstCarpas = findFirstTrabajo(trabajos, "carpas");
  return {
    // Default state: dropdown shows the placeholder ("Filtrar Categoria"),
    // but the content still falls back to the carpas destacado.
    selectedCategoria: "",
    selectedTrabajoId: firstCarpas ? firstCarpas.id : null,
    imageIndex: 0,
    // Invalid trabajoId with no valid category: reset URL to the default state.
    rewriteTo: isInvalidTrabajoId ? window.location.pathname : undefined,
  };
}

export function useWorksUrlState({
  trabajos,
  availableCategorias,
  scrollTargetId,
  imageMap,
}: UseWorksUrlStateOptions): UseWorksUrlStateResult {
  const [initial] = useState(() => resolveUrlState(trabajos, availableCategorias));

  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | "">(initial.selectedCategoria);
  const [selectedTrabajoId, setSelectedTrabajoId] = useState<string | null>(initial.selectedTrabajoId);
  const [imageIndex, setImageIndex] = useState(initial.imageIndex);

  // URL normalization on mount: legacy hash migration or invalid-param cleanup, once.
  useEffect(() => {
    if (initial.rewriteTo) {
      history.replaceState(null, "", initial.rewriteTo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional mount-only rewrite
  }, []);

  const selectedTrabajo = useMemo(
    () =>
      trabajos.find((t) => t.id === selectedTrabajoId) ??
      trabajos.find((t) => t.categoria === selectedCategoria && t.destacado) ??
      trabajos.find((t) => t.categoria === selectedCategoria) ??
      trabajos[0],
    [trabajos, selectedCategoria, selectedTrabajoId],
  );

  const carouselImages = useMemo<WorksCarouselImage[]>(() => {
    if (!selectedTrabajo) return [];
    return selectedTrabajo.imagenes
      .map((imgKey: string, i: number) => ({
        src: imageMap[imgKey],
        alt: `${selectedTrabajo.titulo} - imagen ${i + 1}`,
        originalIndex: i,
      }))
      .filter((_: WorksCarouselImage, i: number) => i !== imageIndex);
  }, [selectedTrabajo, imageIndex, imageMap]);

  const mainImageSrc = selectedTrabajo ? imageMap[selectedTrabajo.imagenes[imageIndex]] : "";
  const mainImageAlt = selectedTrabajo ? `${selectedTrabajo.titulo} - imagen principal` : "";

  const handleCategoriaChange = (categoria: Categoria) => {
    setSelectedCategoria(categoria);
    const firstTrabajo = findFirstTrabajo(trabajos, categoria);
    if (firstTrabajo) {
      setSelectedTrabajoId(firstTrabajo.id);
    }
    setImageIndex(0);
    history.replaceState(null, "", `?${new URLSearchParams({ categoria }).toString()}`);
    document.getElementById(scrollTargetId)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAlbumClick = (albumItem: AlbumImage) => {
    if (!albumItem.trabajoId || !albumItem.categoria) return;
    const image = albumItem.imageIndex ?? 0;
    setSelectedCategoria(albumItem.categoria);
    setSelectedTrabajoId(albumItem.trabajoId);
    setImageIndex(image);
    const params = new URLSearchParams({
      categoria: albumItem.categoria,
      trabajoId: albumItem.trabajoId,
    });
    params.set("imagen", String(image));
    history.replaceState(null, "", `?${params.toString()}`);
    document.getElementById(scrollTargetId)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleThumbSelect = (originalIndex: number) => {
    if (!selectedTrabajo) return;
    setImageIndex(originalIndex);
    const params = new URLSearchParams({
      categoria: selectedTrabajo.categoria,
      trabajoId: selectedTrabajo.id,
    });
    params.set("imagen", String(originalIndex));
    history.replaceState(null, "", `?${params.toString()}`);
    // On mobile the ImgCard sits ABOVE the carousel (single-column grid), so the
    // updated big image would be out of view. Scroll back up to the showcase
    // content. On desktop the layout is side-by-side and already visible.
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (!isDesktop) {
      document.getElementById(scrollTargetId)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return {
    selectedCategoria,
    selectedTrabajoId,
    imageIndex,
    selectedTrabajo,
    carouselImages,
    mainImageSrc,
    mainImageAlt,
    handleCategoriaChange,
    handleAlbumClick,
    handleThumbSelect,
  };
}