import { render, screen } from "@testing-library/react";
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

    beforeEach(() => {
      mockOnPeekTap.mockClear();
    });

    it("renders ImgCard on mobile (no hidden md:block on image wrapper)", () => {
      renderWithPeek();
      // The image wrapper should NOT have "hidden md:block" - the ImgCard should always render
      const img = screen.getByRole("img", { name: "Lona de ejemplo" });
      expect(img).toBeInTheDocument();
      // The peek icon should also be present (not hidden)
      const peekImg = document.querySelector('img[src="https://example.com/peek.png"]');
      expect(peekImg).toBeInTheDocument();
    });

    it("peek icon is a button on mobile with a large touch target and aria-label", () => {
      renderWithPeek();
      const peekButton = screen.getByRole("button", { name: /ver respuesta:/i });
      expect(peekButton).toBeInTheDocument();
      // min-h-14 min-w-14 (56px at default 16px root) — exceeds the 44px
      // WCAG minimum so the logo is easy to see and tap.
      expect(peekButton).toHaveClass("min-h-14");
      expect(peekButton).toHaveClass("min-w-14");
    });

    it("onPeekTap fires with correct FaqBubbleDialogData when peek button is clicked", async () => {
      renderWithPeek();
      const user = userEvent.setup();
      const peekButton = screen.getByRole("button", { name: /ver respuesta:/i });
      await user.click(peekButton);

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
      const peekButton = screen.getByRole("button", { name: /ver respuesta:/i });
      await user.click(peekButton);

      const callArg = mockOnPeekTap.mock.calls[0][0] as FaqBubbleDialogData;
      expect(callArg.highlight).toBe("tu lona");
    });

    it("peek button peeks from RIGHT edge when align=start (mobile)", () => {
      renderWithPeek("start");
      const peekButton = screen.getByRole("button", { name: /ver respuesta:/i });
      // Mobile start: right-0 top-1/2 translate-x-1/2 (peeks from the right
      // edge; no vertical translate — the icon sits toward the card's top
      // half so it reads clearly as a clickable badge).
      expect(peekButton).toHaveClass("right-0");
      expect(peekButton).toHaveClass("top-1/2");
      expect(peekButton).toHaveClass("translate-x-1/2");
      expect(peekButton).not.toHaveClass("-translate-y-1/2");
    });

    it("peek button peeks from LEFT edge when align=end (mobile)", () => {
      renderWithPeek("end");
      const peekButton = screen.getByRole("button", { name: /ver respuesta:/i });
      // Mobile end: left-0 top-1/2 -translate-x-1/2 (peeks from the left edge).
      expect(peekButton).toHaveClass("left-0");
      expect(peekButton).toHaveClass("top-1/2");
      expect(peekButton).toHaveClass("-translate-x-1/2");
      expect(peekButton).not.toHaveClass("-translate-y-1/2");
    });

    it("peek button is keyboard focusable and operable via Enter", async () => {
      renderWithPeek();
      const user = userEvent.setup();
      const peekButton = screen.getByRole("button", { name: /ver respuesta:/i });
      peekButton.focus();
      expect(peekButton).toHaveFocus();
      await user.keyboard("{Enter}");
      expect(mockOnPeekTap).toHaveBeenCalledTimes(1);
    });

    it("does NOT render peek button when align=center (no image slot)", () => {
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
    it("peek icon has pointer-events-none and aria-hidden on desktop (md: classes present)", () => {
      render(
        <FaqBubble
          question="q"
          answer="a"
          image={{ src: "https://example.com/x.jpg", alt: "Lona" }}
          peekIcon="https://example.com/peek.png"
        />,
      );
      const peekButton = screen.getByRole("button", { name: /ver respuesta:/i });
      // Desktop classes should be present: md:pointer-events-none md:aria-hidden
      // The button itself should have these md: prefixed classes
      expect(peekButton).toHaveClass("md:pointer-events-none");
      expect(peekButton).toHaveClass("md:aria-hidden");
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
      const peekButton = screen.getByRole("button", { name: /ver respuesta:/i });
      expect(peekButton).toHaveClass("md:left-[-50%]");
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
      const peekButton = screen.getByRole("button", { name: /ver respuesta:/i });
      expect(peekButton).toHaveClass("md:right-[-50%]");
    });
  });
});
