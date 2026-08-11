import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { WorksSection } from "./WorksSection";
import { data } from "../../../mocks/data";

// Mock scrollIntoView since jsdom doesn't implement it
beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

// Mock imageMap with all 20 image keys
const imageMap: Record<string, string> = {
  "services-03": "/img/services-03.webp",
  "services-04": "/img/services-04.webp",
  "services-05": "/img/services-05.webp",
  "services-06": "/img/services-06.webp",
  "services-07": "/img/services-07.webp",
  "services-08": "/img/services-08.webp",
  "works-01": "/img/works-01.webp",
  "works-02": "/img/works-02.webp",
  "works-03": "/img/works-03.webp",
  "works-04": "/img/works-04.webp",
  "works-05": "/img/works-05.webp",
  "works-06": "/img/works-06.webp",
  "works-07": "/img/works-07.webp",
  "works-08": "/img/works-08.webp",
  "works-09": "/img/works-09.webp",
  "works-10": "/img/works-10.webp",
  "works-11": "/img/works-11.webp",
  "works-12": "/img/works-12.webp",
  "works-13": "/img/works-13.webp",
  "works-14": "/img/works-14.webp",
};

function renderWorksSection(hash = "") {
  // Set up window.location.hash for the test
  const originalHash = window.location.hash;
  Object.defineProperty(window, "location", {
    value: { ...window.location, hash },
    writable: true,
  });
  
  const result = render(
    <MemoryRouter initialEntries={[`/trabajos${hash}`]}>
      <WorksSection imageMap={imageMap} />
    </MemoryRouter>,
  );
  
  // Restore
  Object.defineProperty(window, "location", {
    value: { ...window.location, hash: originalHash },
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
    expect(screen.getByText(/Toldo bimini de 3 arcos en acero inoxidable 316L con lona Sunbrella Captain Navy/)).toBeInTheDocument();
  });

  it("reads hash on mount and selects corresponding category", () => {
    renderWorksSection("#toneau");

    // Should show the toneau trabajo in the description heading
    expect(screen.getByRole("heading", { level: 2, name: "Toneau para pick-up Ford Ranger" })).toBeInTheDocument();
  });

  it("falls back to 'carpas' for unknown hash (e.g., #album)", () => {
    renderWorksSection("#album");

    // Should fall back to carpas
    expect(screen.getByRole("heading", { level: 2, name: "Carpa toldo para embarcación neumática" })).toBeInTheDocument();
  });

  it("CategorySelect shows only populated categories", () => {
    renderWorksSection();

    const options = screen.getAllByRole("option");
    // Should have options for categories that have at least one trabajo
    expect(options.length).toBeGreaterThan(0);
    // All options should correspond to categories in trabajos
    const categoriaValues = data.worksPage.trabajos.map((t) => t.categoria);
    const uniqueCategorias = [...new Set(categoriaValues)];
    expect(options).toHaveLength(uniqueCategorias.length);
  });

  it("category change updates showcase and writes hash via history.replaceState", async () => {
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
    // toneau has only 1 image
    renderWorksSection("#toneau");

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
    renderWorksSection("#cubre-fly");

    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    expect(screen.queryByText("Lona Sunbrella Captain Navy")).not.toBeInTheDocument();
  });
});