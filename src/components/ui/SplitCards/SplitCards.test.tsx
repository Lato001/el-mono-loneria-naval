import { render, screen } from "@testing-library/react";
import { SplitCards } from "./SplitCards";

const items = [
  { title: "Productos", imageKey: "productos" },
  { title: "Trabajos", imageKey: "trabajos" },
  { title: "Otro", imageKey: "otro" },
];

const imageMap = {
  productos: "/productos.jpg",
  trabajos: "/trabajos.jpg",
  otro: "/otro.jpg",
};

describe("SplitCards", () => {
  it("renders a link per item with its title and image", () => {
    render(<SplitCards items={items} imageMap={imageMap} />);
    expect(screen.getAllByRole("link")).toHaveLength(3);
    expect(screen.getAllByText("Productos").length).toBeGreaterThan(0);
    expect(screen.getByAltText("Productos")).toHaveAttribute(
      "src",
      "/productos.jpg",
    );
  });

  it("links each card to its title path", () => {
    render(<SplitCards items={items} imageMap={imageMap} />);
    expect(screen.getByAltText("Trabajos").closest("a")).toHaveAttribute(
      "href",
      "Trabajos",
    );
  });

  it("shows the eyebrow and chips for known card titles", () => {
    render(<SplitCards items={items} imageMap={imageMap} />);
    expect(screen.getByText("Catálogo")).toBeInTheDocument();
    expect(screen.getByText("Portfolio")).toBeInTheDocument();
    expect(screen.getByText("Lona reforzada")).toBeInTheDocument();
    expect(screen.getByText("Varios colores")).toBeInTheDocument();
    expect(screen.getByText("Materiales premium")).toBeInTheDocument();
  });

  it("renders unknown titles without eyebrow or chips", () => {
    render(<SplitCards items={items} imageMap={imageMap} />);
    expect(screen.getAllByText("Otro").length).toBeGreaterThan(0);
    expect(screen.queryByText(/placeholder/i)).not.toBeInTheDocument();
  });
});
