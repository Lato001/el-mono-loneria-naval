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
    expect(options).toHaveLength(mockCategorias.length);
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

  it("applies design system styling: chalk background, pr-hero-blue text, font-poppins", () => {
    render(<CategorySelect value="carpas" options={mockCategorias} onChange={vi.fn()} />);

    const select = screen.getByRole("combobox");
    expect(select).toHaveClass("bg-sc-chalk");
    expect(select).toHaveClass("text-pr-hero-blue");
    expect(select).toHaveClass("font-poppins");
  });

  it("has correct accessibility attributes", () => {
    render(<CategorySelect value="carpas" options={mockCategorias} onChange={vi.fn()} />);

    const select = screen.getByRole("combobox");
    expect(select).toHaveAttribute("aria-label", "Categoría de trabajo");
  });
});