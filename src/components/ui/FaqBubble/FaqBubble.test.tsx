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
    expect(screen.getByRole("img", { name: "Slide A" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Slide B" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Slide C" })).toBeInTheDocument();
  });

  it("does NOT render any image slot when no image prop is passed", () => {
    render(<FaqBubble question="q" answer="a" />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  describe("peekIcon", () => {
    it("renders a hidden peek icon <img> behind the ImgCard when provided", () => {
      render(
        <FaqBubble
          question="q"
          answer="a"
          image={{ src: "https://example.com/x.jpg", alt: "Lona" }}
          peekIcon="https://example.com/peek.png"
        />,
      );
      const peek = document.querySelector(
        'img[src="https://example.com/peek.png"]',
      );
      expect(peek).toBeInTheDocument();
      expect(peek).toHaveAttribute("aria-hidden", "true");
      expect(peek).toHaveAttribute("alt", "");
    });

    it("uses -bottom-1/2 (mobile) + -left-1/2 (desktop) when align=start", () => {
      render(
        <FaqBubble
          question="q"
          answer="a"
          image={{ src: "https://example.com/x.jpg", alt: "Lona" }}
          peekIcon="https://example.com/peek.png"
        />,
      );
      // align=start → image on the right. On mobile the peek overflows
      // downward; on desktop it overflows to the left toward the chat
      // pair.
      const peek = document.querySelector(
        'img[src="https://example.com/peek.png"]',
      ) as HTMLElement;
      expect(peek.className).toContain("-bottom-1/2");
      expect(peek.className).toContain("md:-left-1/2");
    });

    it("uses -bottom-1/2 (mobile) + -right-1/2 (desktop) when align=end", () => {
      render(
        <FaqBubble
          question="q"
          answer="a"
          align="end"
          image={{ src: "https://example.com/x.jpg", alt: "Lona" }}
          peekIcon="https://example.com/peek.png"
        />,
      );
      // align=end → image on the left. On mobile the peek overflows
      // downward; on desktop it overflows to the right toward the chat
      // pair.
      const peek = document.querySelector(
        'img[src="https://example.com/peek.png"]',
      ) as HTMLElement;
      expect(peek.className).toContain("-bottom-1/2");
      expect(peek.className).toContain("md:-right-1/2");
    });

    it("does NOT render any peek icon <img> when peekIcon is omitted", () => {
      const { container } = render(
        <FaqBubble
          question="q"
          answer="a"
          image={{ src: "https://example.com/x.jpg", alt: "Lona" }}
        />,
      );
      const imgs = container.querySelectorAll("img");
      expect(imgs).toHaveLength(1);
      expect(imgs[0]).toHaveAttribute("alt", "Lona");
    });
  });
});
