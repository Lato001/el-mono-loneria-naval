import { render, screen } from "@testing-library/react";
import { RotatingCard } from "./RotatingCard";

const items = [
  { id: "1", title: "Lonas", description: "Lonas a medida", color: "#344784" },
  { id: "2", title: "Capotas", description: "Capotas premium" },
];

describe("RotatingCard", () => {
  it("renders a card per item with its title and description", () => {
    render(<RotatingCard items={items} />);
    expect(screen.getAllByRole("article")).toHaveLength(2);
    expect(screen.getByRole("heading", { name: "Lonas" })).toBeInTheDocument();
    expect(screen.getByText("Capotas premium")).toBeInTheDocument();
  });

  it("renders the color strip only for items that provide one", () => {
    const { container } = render(<RotatingCard items={items} />);
    expect(
      container.querySelectorAll('[style*="background-color"]'),
    ).toHaveLength(1);
  });

  it("skips the color strip when no item provides a color", () => {
    const { container } = render(
      <RotatingCard
        items={[{ id: "3", title: "Sin color", description: "Sin strip" }]}
      />,
    );
    expect(
      container.querySelectorAll('[style*="background-color"]'),
    ).toHaveLength(0);
  });

  it("applies the className prop to the grid", () => {
    const { container } = render(
      <RotatingCard items={items} className="custom-grid" />,
    );
    expect(container.firstElementChild).toHaveClass("custom-grid");
  });
});
