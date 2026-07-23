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

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.textContent).toBe("¿Cuánto tarda tu lona?");
  });

  it("lays out the pair on the start side (left) by default", () => {
    const { container } = render(
      <FaqBubble question="q" answer="a" image={{ alt: "img" }} />,
    );
    const outer = container.firstChild as HTMLElement;
    expect(outer.className).toContain("md:flex-row");
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

  it("renders an ImgCard with a single image when image.src is provided", () => {
    render(
      <FaqBubble
        question="q"
        answer="a"
        image={{ src: "https://example.com/x.jpg", alt: "Una lona" }}
      />,
    );
    // The ImgCard renders an <img> with the given alt.
    const img = screen.getByRole("img", { name: "Una lona" });
    expect(img.tagName).toBe("IMG");
    expect(img).toHaveAttribute("src", "https://example.com/x.jpg");
  });

  it("renders an ImgCard slideshow when image.images has 2+ entries", () => {
    const slides = [
      { src: "https://example.com/a.jpg", alt: "Slide A" },
      { src: "https://example.com/b.jpg", alt: "Slide B" },
      { src: "https://example.com/c.jpg", alt: "Slide C" },
    ];
    render(
      <FaqBubble
        question="q"
        answer="a"
        image={{ alt: "Galería", images: slides }}
      />,
    );
    // All 3 slides render as <img> tags (ImgCard shows the first
    // one and stacks the rest with opacity-0).
    expect(screen.getByRole("img", { name: "Slide A" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Slide B" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Slide C" })).toBeInTheDocument();
  });

  it("does NOT render any image slot when no image prop is passed", () => {
    render(<FaqBubble question="q" answer="a" />);
    // Only the <h2> and <p> exist; no <img> tags anywhere.
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
