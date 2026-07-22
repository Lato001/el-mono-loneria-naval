import { render, screen } from "@testing-library/react";
import { FaqCategoryGrid } from "./FaqCategoryGrid";
import insumosLogo from "../../../assets/logos/icons/insumos-logo.png";
import serviciosLogo from "../../../assets/logos/icons/servicios-logo.png";
import tiemposLogo from "../../../assets/logos/icons/tiempos-logo.png";
import trabajosLogo from "../../../assets/logos/icons/trabajos-logo.png";

describe("FaqCategoryGrid", () => {
  it("renders all 4 default categories with their labels and icons", () => {
    render(<FaqCategoryGrid />);

    expect(screen.getByText("Servicios")).toBeInTheDocument();
    expect(screen.getByText("Tiempos")).toBeInTheDocument();
    expect(screen.getByText("Insumos")).toBeInTheDocument();
    expect(screen.getByText("Trabajos")).toBeInTheDocument();

    // Each label is paired with an icon whose alt matches the label.
    for (const [label, src] of [
      ["Servicios", serviciosLogo],
      ["Tiempos", tiemposLogo],
      ["Insumos", insumosLogo],
      ["Trabajos", trabajosLogo],
    ] as const) {
      const img = screen.getByAltText(label) as HTMLImageElement;
      expect(img).toBeInTheDocument();
      expect(img.src).toContain(src.split("/").pop()!);
    }
  });

  it("exposes a labelled landmark for assistive tech", () => {
    render(<FaqCategoryGrid />);
    expect(
      screen.getByRole("region", { name: /categorías de preguntas/i }),
    ).toBeInTheDocument();
  });

  it("renders a custom category set when provided", () => {
    const custom = [
      { id: "insumos" as const, label: "Materiales", icon: insumosLogo },
    ];
    render(<FaqCategoryGrid categories={custom} />);

    expect(screen.getByText("Materiales")).toBeInTheDocument();
    expect(screen.queryByText("Servicios")).not.toBeInTheDocument();
    expect(screen.queryByText("Tiempos")).not.toBeInTheDocument();
  });
});
