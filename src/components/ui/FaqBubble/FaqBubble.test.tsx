import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FaqBubble } from "./FaqBubble";
import type { FaqBubbleDialogData } from "./FaqBubble.types";

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

  it("hides the chat pair on mobile (hidden md:flex) so only the ImgCard shows", () => {
    const { container } = render(
      <FaqBubble
        question="q"
        answer="a"
        image={{ src: "https://example.com/x.jpg", alt: "Lona" }}
      />,
    );
    // The chat pair container is hidden below md; the ImgCard is not.
    const pair = container.querySelector(
      "div.hidden.md\\:flex.min-w-0",
    );
    expect(pair).not.toBeNull();
    expect(pair!.className).toContain("hidden");
    expect(pair!.className).toContain("md:flex");
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

  describe("mobile behavior", () => {
    const mockOnPeekTap = vi.fn();

    const renderWithPeek = (align: "start" | "end" = "start") =>
      render(
        <FaqBubble
          question="¿Cuánto tarda el servicio?"
          answer="Aprox. 15 días hábiles."
          align={align}
          image={{ src: "https://example.com/x.jpg", alt: "Lona de ejemplo" }}
          peekIcon="https://example.com/peek.png"
          onPeekTap={mockOnPeekTap}
        />,
      );

    const peekImg = () =>
      document.querySelector('img[src="https://example.com/peek.png"]');

    beforeEach(() => {
      mockOnPeekTap.mockClear();
    });

    it("renders ImgCard on mobile (no hidden md:block on image wrapper)", () => {
      renderWithPeek();
      // The image wrapper should NOT have "hidden md:block" - the ImgCard should always render
      const img = screen.getByRole("img", { name: "Lona de ejemplo" });
      expect(img).toBeInTheDocument();
      // The peek icon should also be present (not hidden)
      expect(peekImg()).toBeInTheDocument();
    });

    it("makes the whole ImgCard the tap target on mobile (button with aria-label)", () => {
      renderWithPeek();
      const cardButton = screen.getByRole("button", { name: /ver respuesta:/i });
      expect(cardButton).toBeInTheDocument();
      // The button wraps the ImgCard, so tapping anywhere on the card fires onPeekTap.
      expect(
        within(cardButton).getByRole("img", { name: "Lona de ejemplo" }),
      ).toBeInTheDocument();
      expect(cardButton).toHaveClass("cursor-pointer");
    });

    it("peek icon is a decorative round badge (not a button)", () => {
      renderWithPeek();
      const badge = peekImg();
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute("aria-hidden", "true");
      expect(badge).toHaveClass("pointer-events-none");
      // Large round watermark badge peeking from the card edge; the page
      // level overflow-x-clip trims whatever exceeds the viewport.
      expect(badge).toHaveClass("h-40");
      expect(badge).toHaveClass("w-40");
      expect(badge).toHaveClass("rounded-full");
    });

    it("onPeekTap fires with correct FaqBubbleDialogData when the card is clicked", async () => {
      renderWithPeek();
      const user = userEvent.setup();
      const cardButton = screen.getByRole("button", { name: /ver respuesta:/i });
      await user.click(cardButton);

      expect(mockOnPeekTap).toHaveBeenCalledTimes(1);
      const callArg = mockOnPeekTap.mock.calls[0][0] as FaqBubbleDialogData;
      expect(callArg.question).toBe("¿Cuánto tarda el servicio?");
      expect(callArg.answer).toBe("Aprox. 15 días hábiles.");
      expect(callArg.image).toEqual({
        src: "https://example.com/x.jpg",
        alt: "Lona de ejemplo",
      });
      expect(callArg.highlight).toBeUndefined();
    });

    it("onPeekTap includes highlight when provided", async () => {
      render(
        <FaqBubble
          question="¿Cuánto tarda tu lona?"
          highlight="tu lona"
          answer="15 días."
          image={{ src: "https://example.com/x.jpg", alt: "Lona" }}
          peekIcon="https://example.com/peek.png"
          onPeekTap={mockOnPeekTap}
        />,
      );
      const user = userEvent.setup();
      const cardButton = screen.getByRole("button", { name: /ver respuesta:/i });
      await user.click(cardButton);

      const callArg = mockOnPeekTap.mock.calls[0][0] as FaqBubbleDialogData;
      expect(callArg.highlight).toBe("tu lona");
    });

    it("shows a mobile hint chip on the card (Más info + maximize icon)", () => {
      renderWithPeek();
      const chip = screen.getByText("Más info...");
      expect(chip).toBeInTheDocument();
      // Mobile-only hint; hidden on desktop where the chat pair is visible.
      expect(chip).toHaveClass("md:hidden");
      // The chip sits opposite the peek badge: peek right (start) → chip left.
      expect(chip).toHaveClass("left-3");
      expect(chip.querySelector("svg")).not.toBeNull();
    });

    it("places the hint chip on the right when align=end (peek left)", () => {
      renderWithPeek("end");
      expect(screen.getByText("Más info...")).toHaveClass("right-3");
    });

    it("peek badge peeks from RIGHT edge when align=start (mobile)", () => {
      renderWithPeek("start");
      // Mobile start: right-0 top-1/2 translate-x-1/2 (peeks from the right
      // edge; no vertical translate — the badge sits toward the card's top
      // half so it reads clearly as the brand watermark).
      const badge = peekImg();
      expect(badge).toHaveClass("right-0");
      expect(badge).toHaveClass("top-1/2");
      expect(badge).toHaveClass("translate-x-1/2");
      expect(badge).not.toHaveClass("-translate-y-1/2");
    });

    it("peek badge peeks from LEFT edge when align=end (mobile)", () => {
      renderWithPeek("end");
      // Mobile end: left-0 top-1/2 -translate-x-1/2 (peeks from the left edge).
      const badge = peekImg();
      expect(badge).toHaveClass("left-0");
      expect(badge).toHaveClass("top-1/2");
      expect(badge).toHaveClass("-translate-x-1/2");
      expect(badge).not.toHaveClass("-translate-y-1/2");
    });

    it("card button is keyboard focusable and operable via Enter", async () => {
      renderWithPeek();
      const user = userEvent.setup();
      const cardButton = screen.getByRole("button", { name: /ver respuesta:/i });
      cardButton.focus();
      expect(cardButton).toHaveFocus();
      await user.keyboard("{Enter}");
      expect(mockOnPeekTap).toHaveBeenCalledTimes(1);
    });

    it("ignores taps on desktop (≥768px) so the dialog never opens there", async () => {
      const mm = vi.spyOn(window, "matchMedia").mockImplementation(
        (query: string) =>
          ({
            matches: query === "(min-width: 768px)",
            media: query,
            onchange: null,
            addListener: () => {},
            removeListener: () => {},
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => false,
          }) as unknown as MediaQueryList,
      );
      try {
        renderWithPeek();
        const user = userEvent.setup();
        const cardButton = screen.getByRole("button", { name: /ver respuesta:/i });
        await user.click(cardButton);
        expect(mockOnPeekTap).not.toHaveBeenCalled();
      } finally {
        mm.mockRestore();
      }
    });

    it("does NOT render a tap target button when align=center", () => {
      render(
        <FaqBubble
          question="q"
          answer="a"
          align="center"
          image={{ src: "https://example.com/x.jpg", alt: "Lona" }}
          peekIcon="https://example.com/peek.png"
          onPeekTap={mockOnPeekTap}
        />,
      );
      expect(screen.queryByRole("button", { name: /ver respuesta:/i })).not.toBeInTheDocument();
    });
  });

  describe("desktop peek remains decorative", () => {
    it("peek icon is aria-hidden and pointer-events-none (never interactive)", () => {
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
      expect(peek).toHaveAttribute("aria-hidden", "true");
      expect(peek).toHaveClass("pointer-events-none");
    });

    it("desktop peek positioning uses md:left-[-50%] for align=start", () => {
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
      expect(peek).toHaveClass("md:left-[-50%]");
    });

    it("desktop peek positioning uses md:right-[-50%] for align=end", () => {
      render(
        <FaqBubble
          question="q"
          answer="a"
          align="end"
          image={{ src: "https://example.com/x.jpg", alt: "Lona" }}
          peekIcon="https://example.com/peek.png"
        />,
      );
      const peek = document.querySelector(
        'img[src="https://example.com/peek.png"]',
      );
      expect(peek).toHaveClass("md:right-[-50%]");
    });
  });
});
