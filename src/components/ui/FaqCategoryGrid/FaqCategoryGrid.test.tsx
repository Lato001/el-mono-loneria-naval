import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("exposes a region landmark by default (decorative mode)", () => {
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
  });

  describe("interactive mode (with onSelect)", () => {
    it("exposes a navigation landmark instead of region", () => {
      render(<FaqCategoryGrid onSelect={() => {}} />);
      expect(
        screen.getByRole("navigation", { name: /categorías de preguntas/i }),
      ).toBeInTheDocument();
    });

    it("renders each item as a button with an accessible action label", () => {
      render(<FaqCategoryGrid onSelect={() => {}} />);
      expect(
        screen.getByRole("button", { name: /ir a preguntas de servicios/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /ir a preguntas de tiempos/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /ir a preguntas de insumos/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /ir a preguntas de trabajos/i }),
      ).toBeInTheDocument();
    });

    it("fires onSelect with the category id when a button is clicked", async () => {
      const user = userEvent.setup();
      const handle = vi.fn();
      render(<FaqCategoryGrid onSelect={handle} />);

      await user.click(
        screen.getByRole("button", { name: /ir a preguntas de tiempos/i }),
      );

      expect(handle).toHaveBeenCalledTimes(1);
      expect(handle).toHaveBeenCalledWith("tiempos");
    });

    it("marks the selected category with aria-current=true", () => {
      render(
        <FaqCategoryGrid onSelect={() => {}} selectedId="servicios" />,
      );
      const selected = screen.getByRole("button", {
        name: /ir a preguntas de servicios/i,
      });
      expect(selected).toHaveAttribute("aria-current", "true");
      const others = screen.getAllByRole("button", { name: /ir a/i });
      for (const b of others) {
        if (b === selected) continue;
        expect(b).not.toHaveAttribute("aria-current");
      }
    });
  });
});
