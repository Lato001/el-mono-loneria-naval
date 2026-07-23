import { render, screen } from "@testing-library/react";
import { FaqBubble } from "./FaqBubble";

describe("FaqBubble", () => {
  it("renders the question as a heading and the answer as a paragraph", () => {
    render(
      <FaqBubble
        question="¿Cuánto tardamos?"
        answer="Aprox. 15 días."
      />,
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "¿Cuánto tardamos?" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Aprox. 15 días.")).toBeInTheDocument();
  });

  it("renders a highlight inside the question when provided", () => {
    render(
      <FaqBubble
        question="¿Cuánto tarda tu lona?"
        highlight="tu lona"
        answer="15 días."
      />,
    );

    // Highlight is wrapped in a <span>, the rest of the question is split
    // into the part before and the part after.
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.textContent).toBe("¿Cuánto tarda tu lona?");
  });

  it("lays out the pair on the start side (left) by default", () => {
    const { container } = render(
      <FaqBubble question="q" answer="a" image={{ alt: "img" }} />,
    );
    // The pair wrapper is the first child of the outer flex.
    const outer = container.firstChild as HTMLElement;
    expect(outer.className).toContain("md:flex-row");
    // The pair itself uses items-start when align=start.
    const pair = outer.firstChild as HTMLElement;
    expect(pair.className).toContain("items-start");
  });

  it("flips the layout (image on the left) when align=end", () => {
    const { container } = render(
      <FaqBubble question="q" answer="a" align="end" image={{ alt: "img" }} />,
    );
    const outer = container.firstChild as HTMLElement;
    expect(outer.className).toContain("md:flex-row-reverse");
    const pair = outer.firstChild as HTMLElement;
    expect(pair.className).toContain("items-end");
  });

  it("renders a dashed placeholder when no image src is provided", () => {
    render(<FaqBubble question="q" answer="a" image={{ alt: "Tiempos" }} />);
    // The placeholder exposes the alt as its accessible name and label.
    expect(screen.getByRole("img", { name: "Tiempos" })).toBeInTheDocument();
    expect(screen.getByText("Tiempos")).toBeInTheDocument();
  });

  it("renders a real <img> when image.src is provided", () => {
    render(
      <FaqBubble
        question="q"
        answer="a"
        image={{ src: "https://example.com/x.jpg", alt: "Una lona" }}
      />,
    );
    const img = screen.getByRole("img", { name: "Una lona" });
    expect(img.tagName).toBe("IMG");
    expect(img).toHaveAttribute("src", "https://example.com/x.jpg");
  });

  it("does NOT render any image slot when no image prop is passed", () => {
    render(<FaqBubble question="q" answer="a" />);
    // Only the <h2> and <p> exist; no role=img.
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
