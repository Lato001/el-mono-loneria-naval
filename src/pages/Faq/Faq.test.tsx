import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

const CATEGORY_ANCHOR_PREFIX = "faq-cat-";

describe("Faq page", () => {
  const faqSection = data.home.sections.faq;
  const uniqueCategories = Array.from(
    new Set(data.home.faqs.map((f) => f.category)),
  );

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

  it("renders the 4-up category grid as a navigation with clickable items", () => {
    renderFaq();
    // In interactive mode the grid is exposed as a navigation landmark.
    expect(
      screen.getByRole("navigation", { name: /categorías de preguntas/i }),
    ).toBeInTheDocument();
    for (const label of ["Servicios", "Tiempos", "Insumos", "Trabajos"]) {
      expect(
        screen.getByRole("button", { name: new RegExp(label, "i") }),
      ).toBeInTheDocument();
    }
  });

  it("renders one SectionWrapper per unique category, each with a stable id", () => {
    renderFaq();
    for (const cat of uniqueCategories) {
      const section = document.getElementById(
        `${CATEGORY_ANCHOR_PREFIX}${cat}`,
      );
      expect(section).not.toBeNull();
      expect(section!.tagName).toBe("SECTION");
    }
  });

  it("renders every FAQ question as a heading", () => {
    renderFaq();
    // All 5 FAQs are rendered (not just the first 3 like before).
    for (const f of data.home.faqs) {
      expect(
        screen.getByRole("heading", { level: 2, name: f.q }),
      ).toBeInTheDocument();
      expect(screen.getByText(f.a)).toBeInTheDocument();
    }
  });

  it("lays out each bubble with the align assigned to its category", () => {
    const { container } = renderFaq();
    // Each FaqBubble's outer layout wrapper has md:flex-row or md:flex-row-reverse.
    const layouts = container.querySelectorAll(
      "div.flex.w-full.gap-6.flex-col.items-stretch",
    );
    expect(layouts).toHaveLength(data.home.faqs.length);
    layouts.forEach((el, i) => {
      const faq = data.home.faqs[i];
      const expected =
        faq.category === "insumos" || faq.category === "servicios"
          ? "md:flex-row"
          : "md:flex-row-reverse";
      expect(el.className).toContain(expected);
    });
  });

  it("scrolls to the matching category section when a grid item is clicked", async () => {
    const user = userEvent.setup();
    const scrollIntoView = vi.fn();
    const original = HTMLElement.prototype.scrollIntoView;
    HTMLElement.prototype.scrollIntoView = scrollIntoView;

    try {
      renderFaq();
      await user.click(
        screen.getByRole("button", { name: /ir a preguntas de tiempos/i }),
      );
      expect(scrollIntoView).toHaveBeenCalledTimes(1);
      const [calledEl] = scrollIntoView.mock.instances[0]
        ? [scrollIntoView.mock.instances[0]]
        : [];
      // The element we scrolled to should be the 'tiempos' section.
      const targetId = (calledEl as HTMLElement | undefined)?.id;
      expect(targetId).toBe(`${CATEGORY_ANCHOR_PREFIX}tiempos`);
    } finally {
      HTMLElement.prototype.scrollIntoView = original;
    }
  });

  it("renders an ImgCard for every bubble", () => {
    renderFaq();
    // One <img> per FAQ (ImgCard renders a single <img> when not in slideshow).
    const imgs = screen.getAllByRole("img", { name: /imagen de/i });
    expect(imgs).toHaveLength(data.home.faqs.length);
  });
});
