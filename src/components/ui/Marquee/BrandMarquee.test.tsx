import { render, screen } from "@testing-library/react";
import { BrandMarquee } from "./BrandMarquee";

describe("BrandMarquee", () => {
  it("renders every brand from data.brands", () => {
    render(<BrandMarquee />);
    for (const brand of ["Sauleda", "YKK", "Sunbrella", "Coats", "Achilles"]) {
      expect(screen.getAllByAltText(brand).length).toBeGreaterThan(0);
    }
  });

  it("links brands to their website when a link is configured", () => {
    render(<BrandMarquee />);
    const sauleda = screen.getAllByAltText("Sauleda")[0];
    expect(sauleda.closest("a")).toHaveAttribute(
      "href",
      "https://sauleda.com/",
    );
  });

  it("renders brands without a configured link without an href", () => {
    render(<BrandMarquee />);
    // Achilles has no `link` in data.brands — its anchor is rendered with no href.
    const achilles = screen.getAllByAltText("Achilles")[0];
    expect(achilles.closest("a")).not.toBeNull();
    expect(achilles.closest("a")!.getAttribute("href")).toBeNull();
  });

  it("applies the className prop to the marquee container", () => {
    const { container } = render(<BrandMarquee className="border-4" />);
    expect(container.firstElementChild).toHaveClass("border-4");
  });
});
