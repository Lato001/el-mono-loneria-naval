import { render, screen, act } from "@testing-library/react";
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

  it("renders prev and next buttons with correct aria-labels", () => {
    render(
      <ProductCarousel items={mockProducts} ariaLabel="Test" id="test-section" />,
    );

    expect(screen.getByLabelText("Anterior")).toBeInTheDocument();
    expect(screen.getByLabelText("Siguiente")).toBeInTheDocument();
  });

  it("calls scrollBy on next button click", async () => {
    const user = userEvent.setup();
    render(
      <ProductCarousel items={mockProducts} ariaLabel="Test" id="test-section" />,
    );

    const scrollContainer = document.querySelector(".overflow-x-auto") as HTMLElement;
    // jsdom doesn't implement scrollBy — define it before spying
    scrollContainer.scrollBy = vi.fn();

    await user.click(screen.getByLabelText("Siguiente"));
    expect(scrollContainer.scrollBy).toHaveBeenCalledWith(
      expect.objectContaining({ behavior: "smooth" }),
    );
  });

  it("calls scrollBy on prev button click", async () => {
    const user = userEvent.setup();
    render(
      <ProductCarousel items={mockProducts} ariaLabel="Test" id="test-section" />,
    );

    const scrollContainer = document.querySelector(".overflow-x-auto") as HTMLElement;
    scrollContainer.scrollBy = vi.fn();

    await user.click(screen.getByLabelText("Anterior"));
    expect(scrollContainer.scrollBy).toHaveBeenCalledWith(
      expect.objectContaining({ behavior: "smooth" }),
    );
  });

  it("renders section with correct role and aria-labelledby", () => {
    render(
      <ProductCarousel items={mockProducts} ariaLabel="Test" id="test-section" />,
    );

    const section = screen.getByRole("tabpanel");
    expect(section).toHaveAttribute("id", "test-section");
    expect(section).toHaveAttribute("aria-labelledby", "tab-test-section");
  });

  it("calls onQuotationOpen when card CTA is clicked", async () => {
    const user = userEvent.setup();
    const onQuotationOpen = vi.fn();

    render(
      <ProductCarousel
        items={mockProducts}
        ariaLabel="Test"
        id="test-section"
        onQuotationOpen={onQuotationOpen}
      />,
    );

    // Find the first "Cotizar" button
    const cotizarButtons = screen.getAllByLabelText("Cotizar");
    await user.click(cotizarButtons[0]);

    expect(onQuotationOpen).toHaveBeenCalledWith(mockProducts[0]);
  });

  it("renders N dots where N = Math.ceil(items.length / itemsPerPage)", () => {
    render(
      <ProductCarousel items={mockProducts} ariaLabel="Test" id="test-section" />,
    );

    // In jsdom, layout measurements return 0, so itemsPerPage = 1
    // totalPages = Math.ceil(3 / 1) = 3
    const dots = screen.getAllByLabelText(/Ir a producto/);
    expect(dots).toHaveLength(Math.ceil(mockProducts.length / 1));
  });

  it("marks the first dot as active initially", () => {
    render(
      <ProductCarousel items={mockProducts} ariaLabel="Test" id="test-section" />,
    );

    const dots = screen.getAllByLabelText(/Ir a producto/);
    expect(dots[0]).toHaveAttribute("aria-current", "true");
    expect(dots[1]).not.toHaveAttribute("aria-current");
    expect(dots[2]).not.toHaveAttribute("aria-current");
  });

  it("updates aria-current on the active dot after simulated scroll", () => {
    // Mock requestAnimationFrame to run synchronously
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });

    render(
      <ProductCarousel items={mockProducts} ariaLabel="Test" id="test-section" />,
    );

    const scrollContainer = document.querySelector(".overflow-x-auto") as HTMLElement;
    scrollContainer.scrollBy = vi.fn();

    // Mock children offsetLeft values so the scroll handler computes cardIndex > 0
    const cards = scrollContainer.children;
    Object.defineProperty(cards[1], "offsetLeft", { value: 300, configurable: true });
    Object.defineProperty(cards[2], "offsetLeft", { value: 600, configurable: true });

    // Simulate scroll to second page position (wrapped in act for state update)
    act(() => {
      Object.defineProperty(scrollContainer, "scrollLeft", {
        value: 300,
        writable: true,
        configurable: true,
      });
      scrollContainer.dispatchEvent(new Event("scroll"));
    });

    const dots = screen.getAllByLabelText(/Ir a producto/);
    expect(dots[1]).toHaveAttribute("aria-current", "true");
    expect(dots[0]).not.toHaveAttribute("aria-current");
    expect(dots[2]).not.toHaveAttribute("aria-current");

    vi.unstubAllGlobals();
  });
});
