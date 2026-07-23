import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Faq } from "./Faq";
import { data } from "../../mocks/data";

function renderFaq() {
  return render(
    <MemoryRouter initialEntries={["/faq"]}>
      <Faq />
    </MemoryRouter>,
  );
}

describe("Faq page", () => {
  const faqSection = data.home.sections.faq;
  const bubbles = data.home.faqs.slice(0, 3);
  const aligns: Array<"start" | "end"> = ["start", "end", "start"];

  it("renders the page-level heading (h1) with the FAQ title", () => {
    renderFaq();
    expect(
      screen.getByRole("heading", { level: 1, name: faqSection.title }),
    ).toBeInTheDocument();
  });

  it("renders the eyebrow above the title", () => {
    renderFaq();
    expect(screen.getByText(faqSection.eyebrow)).toBeInTheDocument();
  });

  it("renders the 4-up category grid with all category labels", () => {
    renderFaq();
    expect(
      screen.getByRole("region", { name: /categorías de preguntas/i }),
    ).toBeInTheDocument();
    for (const label of ["Servicios", "Tiempos", "Insumos", "Trabajos"]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it("renders 3 FAQ bubbles with the first 3 questions from data", () => {
    renderFaq();
    for (const bubble of bubbles) {
      expect(
        screen.getByRole("heading", { level: 2, name: bubble.q }),
      ).toBeInTheDocument();
      expect(screen.getByText(bubble.a)).toBeInTheDocument();
    }
  });

  it("does NOT render bubbles for the questions beyond the first 3", () => {
    renderFaq();
    const remaining = data.home.faqs.slice(3);
    for (const faq of remaining) {
      expect(
        screen.queryByRole("heading", { level: 2, name: faq.q }),
      ).not.toBeInTheDocument();
      expect(screen.queryByText(faq.a)).not.toBeInTheDocument();
    }
  });

  it("lays out the bubbles with alternating alignments: start, end, start", () => {
    const { container } = renderFaq();
    // Each bubble's outer layout wrapper has md:flex-row or md:flex-row-reverse.
    const layouts = container.querySelectorAll(
      "div.flex.w-full.gap-6.flex-col.items-stretch",
    );
    expect(layouts).toHaveLength(3);
    for (let i = 0; i < aligns.length; i++) {
      const expected = aligns[i] === "start" ? "md:flex-row" : "md:flex-row-reverse";
      expect(layouts[i].className).toContain(expected);
    }
  });

  it("renders a dashed image placeholder for every bubble", () => {
    renderFaq();
    // Each bubble has an image slot; 3 bubbles = 3 placeholders.
    // Filter by accessible name prefix so we don't count the 4 PNG icons
    // rendered by FaqCategoryGrid (which use bare category names).
    const placeholders = screen.getAllByRole("img", { name: /imagen de/i });
    expect(placeholders).toHaveLength(3);
    // Each placeholder exposes a category-specific label.
    expect(
      screen.getByRole("img", { name: /imagen de tiempos/i }),
    ).toBeInTheDocument();
  });
});
