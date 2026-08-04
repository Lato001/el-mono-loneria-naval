import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductCarousel } from "./ProductCarousel";
import type { Product } from "./ProductCarousel.types";

// Mock useFadeInOnView to avoid IntersectionObserver complexity in carousel tests
vi.mock("../../../hooks/useFadeInOnView", () => ({
  useFadeInOnView: () => ({ ref: { current: null }, visible: true }),
}));

const mockProducts: Product[] = [
  { id: "p1", title: "Producto 1", description: "Desc 1", imageSrc: "/img1.jpg" },
  { id: "p2", title: "Producto 2", description: "Desc 2", imageSrc: "/img2.jpg" },
  { id: "p3", title: "Producto 3", description: "Desc 3", imageSrc: "/img3.jpg" },
];

describe("ProductCarousel", () => {
  it("renders all product cards", () => {
    render(
      <ProductCarousel items={mockProducts} ariaLabel="Test" id="test-section" />,
    );

    const articles = screen.getAllByRole("article");
    expect(articles).toHaveLength(3);
  });

  it("does not render prev/next controls (they live in the parent)", () => {
    render(
      <ProductCarousel items={mockProducts} ariaLabel="Test" id="test-section" />,
    );

    expect(screen.queryByLabelText("Anterior")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Siguiente")).not.toBeInTheDocument();
  });

  it("attaches the provided scrollRef to the scroll container", () => {
    const scrollRef = { current: null as HTMLDivElement | null };
    render(
      <ProductCarousel
        items={mockProducts}
        ariaLabel="Test"
        id="test-section"
        scrollRef={scrollRef}
      />,
    );

    const scrollContainer = document.querySelector(".overflow-x-auto");
    expect(scrollContainer).toBe(scrollRef.current);
  });

  it("renders section with correct role and aria-labelledby", () => {
    render(
      <ProductCarousel items={mockProducts} ariaLabel="Test" id="test-section" />,
    );

    const section = screen.getByRole("tabpanel");
    expect(section).toHaveAttribute("id", "test-section");
    expect(section).toHaveAttribute("aria-labelledby", "tab-test-section");
  });

  it("passes isSelected and onToggle to each card", async () => {
    const user = userEvent.setup();
    const isSelected = vi.fn((id: string) => id === "p2");
    const onToggle = vi.fn();

    render(
      <ProductCarousel
        items={mockProducts}
        ariaLabel="Test"
        id="test-section"
        isSelected={isSelected}
        onToggle={onToggle}
      />,
    );

    // p2 is selected → its checkbox should be checked
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(3);
    expect(checkboxes[0]).not.toBeChecked(); // p1
    expect(checkboxes[1]).toBeChecked(); // p2
    expect(checkboxes[2]).not.toBeChecked(); // p3

    // Clicking p1's checkbox should call onToggle with "p1"
    await user.click(checkboxes[0]);
    expect(onToggle).toHaveBeenCalledWith("p1");
  });

  it("does not render dot indicators", () => {
    render(
      <ProductCarousel items={mockProducts} ariaLabel="Test" id="test-section" />,
    );

    expect(screen.queryAllByLabelText(/Ir a producto/)).toHaveLength(0);
  });
});
