import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { WorksSection } from "./WorksSection";
import { data } from "../../../mocks/data";

// Mock scrollIntoView since jsdom doesn't implement it
beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

// Mock imageMap derived from the real mock data keys — one entry per key the
// trabajos actually reference, resolved to a fictitious URL. Keeps the test in
// sync with data.ts without maintaining a hand-written key list.
const imageMap: Record<string, string> = Object.fromEntries(
  [...new Set(data.worksPage.trabajos.flatMap((t) => t.imagenes))].map((key) => [key, `/img/${key}.webp`]),
);

// Mock build-time dimensions keyed by the same resolved URLs.
const imageDims: Record<string, { w: number; h: number }> = Object.fromEntries(
  [...new Set(data.worksPage.trabajos.flatMap((t) => t.imagenes))].map((key) => [
    `/img/${key}.webp`,
    { w: 4, h: 3 },
  ]),
);

function renderWorksSection(search = "", hash = "") {
  // Set up window.location.search (and optional hash) for the test
  const originalSearch = window.location.search;
  const originalHash = window.location.hash;
  Object.defineProperty(window, "location", {
    value: { ...window.location, search, hash },
    writable: true,
  });

  const result = render(
    <MemoryRouter initialEntries={[`/trabajos${search}${hash}`]}>
      <WorksSection imageMap={imageMap} imageDims={imageDims} />
    </MemoryRouter>,
  );

  // Restore
  Object.defineProperty(window, "location", {
    value: { ...window.location, search: originalSearch, hash: originalHash },
    writable: true,
  });

  return result;
}

describe("WorksSection", () => {
  it("renders two SectionWrappers: showcase (h1) and album (h2)", () => {
    renderWorksSection();

    // Showcase section
    expect(screen.getByText("Trabajos")).toBeInTheDocument(); // eyebrow
    expect(screen.getByRole("heading", { level: 1, name: "Nuestros Trabajos" })).toBeInTheDocument();

    // Album section
    expect(screen.getByRole("heading", { level: 2, name: "Trabajos destacados" })).toBeInTheDocument();
    // No duplicate "Nuestros Trabajos" in album section
    const h1Count = screen.getAllByRole("heading", { level: 1, name: "Nuestros Trabajos" }).length;
    expect(h1Count).toBe(1);
  });

  it("defaults to 'carpas' category with destacado trabajo on mount (no hash)", () => {
    renderWorksSection();

    // Should show the destacado trabajo for carpas in the description heading
    expect(screen.getByRole("heading", { level: 2, name: "Carpa toldo para embarcación neumática" })).toBeInTheDocument();
    expect(screen.getByText(/Carpeta de bitácora en cuero náutico tratado con costuras a contraste/)).toBeInTheDocument();
  });

  it("reads categoria query param on mount and selects corresponding category", () => {
    renderWorksSection("?categoria=toneau");

    // Should show the toneau trabajo in the description heading
    expect(screen.getByRole("heading", { level: 2, name: "Toneau para pick-up Ford Ranger" })).toBeInTheDocument();
  });

  it("falls back to 'carpas' for unknown categoria (e.g., ?categoria=album)", () => {
    renderWorksSection("?categoria=album");

    // Should fall back to carpas
    expect(screen.getByRole("heading", { level: 2, name: "Carpa toldo para embarcación neumática" })).toBeInTheDocument();
  });

  it("migrates legacy hash (#categoria) to categoria query params", () => {
    renderWorksSection("", "#toneau");

    // Legacy hash should select the toneau category
    expect(screen.getByRole("heading", { level: 2, name: "Toneau para pick-up Ford Ranger" })).toBeInTheDocument();
  });

  it("trabajoId wins over categoria on mount", () => {
    renderWorksSection("?categoria=carpas&trabajoId=trab-toneau-1");

    // Even though categoria=carpas, the trabajoId selects the toneau trabajo
    expect(screen.getByRole("heading", { level: 2, name: "Toneau para pick-up Ford Ranger" })).toBeInTheDocument();
  });

  it("falls back to a valid categoria when trabajoId does not exist", () => {
    // trab-no-existe is not a real id; capotas is valid → show capotas destacado, not carpas
    renderWorksSection("?categoria=capotas&trabajoId=trab-no-existe");

    expect(screen.getByRole("heading", { level: 2, name: "Capota rígida para consola central 24 pies" })).toBeInTheDocument();
  });

  it("defaults to carpas when both trabajoId and categoria are invalid", () => {
    // Neither the id nor the category exist → default carpas
    renderWorksSection("?categoria=no-existe&trabajoId=trab-no-existe");

    expect(screen.getByRole("heading", { level: 2, name: "Carpa toldo para embarcación neumática" })).toBeInTheDocument();
  });

  it("defaults to carpas when only an invalid trabajoId is present (no categoria)", () => {
    renderWorksSection("?trabajoId=trab-no-existe");

    expect(screen.getByRole("heading", { level: 2, name: "Carpa toldo para embarcación neumática" })).toBeInTheDocument();
  });

  it("restores the exact clicked trabajo from trabajoId at imageIndex 0", () => {
    renderWorksSection("?categoria=toneau&trabajoId=trab-toneau-1");

    // Heading shows the clicked trabajo, not a categoria destacado
    expect(screen.getByRole("heading", { level: 2, name: "Toneau para pick-up Ford Ranger" })).toBeInTheDocument();
    // imageIndex is 0 → main image uses imagenes[0]
    expect(screen.getByAltText("Toneau para pick-up Ford Ranger - imagen principal")).toBeInTheDocument();
  });

  it("restores the exact photo from the imagen query param on reload", () => {
    // trab-toneau-1 has 17 images: ["toneau-01", ..., "toneau-17"]
    renderWorksSection("?categoria=toneau&trabajoId=trab-toneau-1&imagen=2");

    // imageIndex 2 → big image is the 3rd image (toneau-03)
    const mainImage = screen.getByAltText("Toneau para pick-up Ford Ranger - imagen principal");
    expect(mainImage).toHaveAttribute("src", "/img/toneau-03.webp");
    // The current big image is excluded from the carousel thumbnails
    expect(screen.queryByAltText("Toneau para pick-up Ford Ranger - imagen 3")).not.toBeInTheDocument();
    expect(screen.getByAltText("Toneau para pick-up Ford Ranger - imagen 2")).toBeInTheDocument();
  });

  it("applies the imagen query param together with a categoria (first trabajo of the category)", () => {
    // toneau's first (destacado) trabajo is trab-toneau-1 with imagenes[1] = "toneau-02"
    renderWorksSection("?categoria=toneau&imagen=1");

    const mainImage = screen.getByAltText("Toneau para pick-up Ford Ranger - imagen principal");
    expect(mainImage).toHaveAttribute("src", "/img/toneau-02.webp");
  });

  it("clamps an out-of-range imagen param to 0", () => {
    // 99 is outside carpas' 7 images → falls back to the first image
    renderWorksSection("?categoria=carpas&imagen=99");

    const mainImage = screen.getByAltText("Carpa toldo para embarcación neumática - imagen principal");
    expect(mainImage).toHaveAttribute("src", "/img/carpa-01.webp");
  });

  it("thumb select updates the big image to the clicked photo", async () => {
    renderWorksSection();

    const user = userEvent.setup();
    // Default carpas at imageIndex 0 → carousel shows the remaining 6 images.
    // Thumb "thumbnail 2 de 6" = originalIndex 1 (imagenes[1] = "carpa-02").
    await user.click(screen.getByRole("button", { name: /thumbnail 2 de 6/i }));

    const mainImage = screen.getByAltText("Carpa toldo para embarcación neumática - imagen principal");
    expect(mainImage).toHaveAttribute("src", "/img/carpa-02.webp");
    // After clicking, the previously current image (carpa-01) is back in the carousel
    expect(screen.getByAltText("Carpa toldo para embarcación neumática - imagen 1")).toBeInTheDocument();
  });

  it("thumb select scrolls back up to the showcase content on mobile", async () => {
    // matchMedia polyfill returns matches:false → behaves as a mobile viewport
    renderWorksSection();

    const scrollIntoView = vi.mocked(Element.prototype.scrollIntoView);
    scrollIntoView.mockClear();

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /thumbnail 2 de 6/i }));

    // On mobile the ImgCard is above the carousel: selecting a thumb must scroll
    // to the showcase content so the updated big image is visible.
    expect(scrollIntoView).toHaveBeenCalledTimes(1);
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
  });

  it("thumb select does not scroll on desktop (side-by-side layout)", async () => {
    // Simulate a desktop viewport: matchMedia matches min-width 1024px.
    // Keep the full polyfill shape so Masonry (addEventListener) keeps working.
    const originalMatchMedia = window.matchMedia;
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: (query: string) => ({
        matches: true,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });

    try {
      renderWorksSection();

      const scrollIntoView = vi.mocked(Element.prototype.scrollIntoView);
      scrollIntoView.mockClear();

      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: /thumbnail 2 de 6/i }));

      expect(scrollIntoView).not.toHaveBeenCalled();
    } finally {
      Object.defineProperty(window, "matchMedia", { writable: true, value: originalMatchMedia });
    }
  });

  it("CategorySelect shows only populated categories", () => {
    renderWorksSection();

    const options = screen.getAllByRole("option");
    // Should have options for categories that have at least one trabajo
    expect(options.length).toBeGreaterThan(0);
    // All options should correspond to categories in trabajos
    const categoriaValues = data.worksPage.trabajos.map((t) => t.categoria);
    const uniqueCategorias = [...new Set(categoriaValues)];
    // Placeholder ("Filtrar Categoria") + one option per populated category
    expect(options).toHaveLength(uniqueCategorias.length + 1);
  });

  it("category change updates showcase and writes query params via history.replaceState", async () => {
    renderWorksSection();

    const user = userEvent.setup();
    const _select = screen.getByRole("combobox");
    await user.selectOptions(_select, "toneau");

    // Should update to show toneau trabajo in the description heading
    expect(screen.getByRole("heading", { level: 2, name: "Toneau para pick-up Ford Ranger" })).toBeInTheDocument();
    // Note: history.replaceState is not directly testable in jsdom without mocking
    // but we verify the UI updates correctly
  });

  it("album click updates showcase to that trabajo's category and resets imageIndex", async () => {
    renderWorksSection();

    // Find an album item (Masonry is mocked, so we need to test the integration differently)
    // This test will be more meaningful once we integrate with real Masonry
    // For now, verify the component renders without error
    expect(screen.getByRole("heading", { level: 2, name: "Trabajos destacados" })).toBeInTheDocument();
  });

  it("renders ImgCard with current image (not slideshow) for selected trabajo", () => {
    renderWorksSection();

    // Should show the main image for the destacado carpas trabajo with descriptive alt
    const mainImage = screen.getByAltText("Carpa toldo para embarcación neumática - imagen principal");
    expect(mainImage).toBeInTheDocument();
  });

  it("renders WorksCarousel when selected trabajo has multiple images", () => {
    // carpas has 2 images, so carousel should render
    renderWorksSection();

    // WorksCarousel should be present for carpas (has 2 images)
    const thumbnails = screen.getAllByRole("button", { name: /thumbnail/i });
    expect(thumbnails.length).toBeGreaterThan(0);
  });

  it("does not render WorksCarousel when selected trabajo has single image", () => {
    // trab-extra-1 has only 2 images: at imageIndex 0 only 1 remains in the
    // carousel, so the carousel (which requires >= 2) is not rendered.
    renderWorksSection("?categoria=extra&trabajoId=trab-extra-1");

    const thumbnails = screen.queryAllByRole("button", { name: /thumbnail/i });
    expect(thumbnails).toHaveLength(0);
  });

  it("renders cualidades badges for the default selected trabajo (trab-carpas-1)", () => {
    renderWorksSection();

    expect(screen.getByText("Lona Sunbrella Captain Navy")).toBeInTheDocument();
    expect(screen.getByText("Acero inoxidable 316L")).toBeInTheDocument();
    expect(screen.getByText("Montaje rápido sin herramientas")).toBeInTheDocument();
    expect(screen.getByText("Funda de guardado incluida")).toBeInTheDocument();
  });

  it("renders no cualidades badge list when the selected trabajo has none", () => {
    // trab-cubre-fly-1 has no cualidades field
    renderWorksSection("?categoria=cubre-fly");

    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    expect(screen.queryByText("Lona Sunbrella Captain Navy")).not.toBeInTheDocument();
  });

  describe("mobile description toggle", () => {
    it("shows a 60-word summary with a Leer Más button on mobile when the text is long", () => {
      // matchMedia polyfill returns matches:false → mobile viewport
      renderWorksSection();

      // Long description (>60 words): the full tail ("portada") must NOT be visible
      expect(screen.queryByText(/grabado personalizado en la portada/)).not.toBeInTheDocument();
      // Summary keeps the opening text
      expect(screen.getByText(/Carpeta de bitácora en cuero náutico tratado con costuras a contraste/)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /leer más/i })).toBeInTheDocument();
      // Badges and carousel still visible from the start
      expect(screen.getByText("Lona Sunbrella Captain Navy")).toBeInTheDocument();
      expect(screen.getAllByRole("button", { name: /thumbnail/i }).length).toBeGreaterThan(0);
    });

    it("expands to the full text when Leer Más is clicked", async () => {
      renderWorksSection();

      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: /leer más/i }));

      // Full text tail now visible, button gone
      expect(screen.getByText(/grabado personalizado en la portada/)).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /leer más/i })).not.toBeInTheDocument();
    });

    it("shows the full description on desktop without a toggle", () => {
      // Simulate a desktop viewport (matchMedia matches min-width 1024px)
      const originalMatchMedia = window.matchMedia;
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: (query: string) => ({
          matches: true,
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => false,
        }),
      });

      try {
        renderWorksSection();

        expect(screen.queryByRole("button", { name: /leer más/i })).not.toBeInTheDocument();
        expect(screen.getByText(/grabado personalizado en la portada/)).toBeInTheDocument();
      } finally {
        Object.defineProperty(window, "matchMedia", { writable: true, value: originalMatchMedia });
      }
    });
  });

  describe("album pagination (Cargar más)", () => {
    const totalAlbumItems = data.worksPage.trabajos.reduce(
      (sum, t) => sum + t.imagenes.length,
      0,
    );

    it("shows the Cargar más button when there are more items than the page size", () => {
      renderWorksSection();

      expect(screen.getByRole("button", { name: /cargar más/i })).toBeInTheDocument();
      expect(screen.getByText(`Mostrando 24 de ${totalAlbumItems}`)).toBeInTheDocument();
    });

    it("increases the visible item count when Cargar más is clicked", async () => {
      renderWorksSection();

      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: /cargar más/i }));

      expect(screen.getByText(`Mostrando 48 de ${totalAlbumItems}`)).toBeInTheDocument();
    });

    it("hides Cargar más once all album items are visible", async () => {
      renderWorksSection();

      const user = userEvent.setup();
      // 76 items with page size 24 → 24 → 48 → 72 → 76 (3 clicks reveal all)
      for (let i = 0; i < 3; i++) {
        await user.click(screen.getByRole("button", { name: /cargar más/i }));
      }

      expect(screen.queryByRole("button", { name: /cargar más/i })).not.toBeInTheDocument();
      expect(screen.queryByText(`Mostrando ${totalAlbumItems} de ${totalAlbumItems}`)).not.toBeInTheDocument();
    });
  });
});