import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CategorySelect } from "./CategorySelect";
import type { Categoria } from "../../../types/trabajo";

const mockCategorias: Categoria[] = ["carpas", "capotas", "cerramientos", "toneau"];

describe("CategorySelect", () => {
  it("renders a native select element with provided options", () => {
    render(<CategorySelect value="carpas" options={mockCategorias} onChange={vi.fn()} />);

    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue("carpas");
  });

  it("renders only the provided categories as options with capitalized labels", () => {
    render(<CategorySelect value="carpas" options={mockCategorias} onChange={vi.fn()} />);

    const options = screen.getAllByRole("option");
    // Placeholder ("Filtrar Categoria") + the provided categories
    expect(options).toHaveLength(mockCategorias.length + 1);
    // Placeholder is the default (empty) value
    expect(screen.getByRole("option", { name: "Filtrar Categoria" })).toHaveValue("");
    // Options display capitalized labels but have slug values
    expect(screen.getByRole("option", { name: "Carpas" })).toHaveValue("carpas");
    expect(screen.getByRole("option", { name: "Capotas" })).toHaveValue("capotas");
    expect(screen.getByRole("option", { name: "Cerramientos" })).toHaveValue("cerramientos");
    expect(screen.getByRole("option", { name: "Toneau" })).toHaveValue("toneau");
  });

  it("calls onChange with the selected category when user changes selection", async () => {
    const onChange = vi.fn();
    render(<CategorySelect value="carpas" options={mockCategorias} onChange={onChange} />);

    const user = userEvent.setup();
    const select = screen.getByRole("combobox");
    await user.selectOptions(select, "capotas");

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("capotas");
  });

  it("applies design system styling: chalk background, ocean-blue text, font-poppins", () => {
    render(<CategorySelect value="carpas" options={mockCategorias} onChange={vi.fn()} />);

    const select = screen.getByRole("combobox");
    expect(select).toHaveClass("bg-sc-chalk");
    expect(select).toHaveClass("text-sc-ocean-blue");
    expect(select).toHaveClass("font-poppins");
  });

  it("keeps the same chalk style on the placeholder (empty value) and when filtered", () => {
    const { rerender } = render(
      <CategorySelect value="" options={mockCategorias} onChange={vi.fn()} />,
    );

    // Placeholder / no filter → chalk background, readable dark text
    expect(screen.getByRole("combobox")).toHaveClass("bg-sc-chalk");
    expect(screen.getByRole("combobox")).toHaveClass("text-sc-ocean-blue");

    // Filter selected → keeps the same chalk style (no dynamic variant)
    rerender(<CategorySelect value="carpas" options={mockCategorias} onChange={vi.fn()} />);
    expect(screen.getByRole("combobox")).toHaveClass("bg-sc-chalk");
    expect(screen.getByRole("combobox")).toHaveClass("text-sc-ocean-blue");
    expect(screen.getByRole("combobox")).not.toHaveClass("bg-sc-sky-blue/10");
  });

  it("has correct accessibility attributes", () => {
    render(<CategorySelect value="carpas" options={mockCategorias} onChange={vi.fn()} />);

    const select = screen.getByRole("combobox");
    expect(select).toHaveAttribute("aria-label", "Categoría de trabajo");
  });
});