import { render, screen, within } from "@testing-library/react";
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
        screen.getByRole("button", {
          name: new RegExp(`ir a preguntas de ${label}`, "i"),
        }),
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
    // Bubbles render grouped by category (canonical order), so match each
    // layout back to its FAQ by question text instead of array index.
    const layouts = container.querySelectorAll(
      "div.flex.w-full.gap-6.flex-col.items-stretch",
    );
    expect(layouts).toHaveLength(data.home.faqs.length);
    layouts.forEach((el) => {
      const question = el.querySelector("h2")?.textContent;
      const faq = data.home.faqs.find((f) => f.q === question);
      expect(faq).toBeDefined();
      const expected =
        faq!.category === "insumos" || faq!.category === "servicios"
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

  it("renders the category sections in canonical order: insumos, tiempos, servicios, trabajos", () => {
    const { container } = renderFaq();
    // The 4 category SectionWrappers have ids faq-cat-<id>.
    const sections = container.querySelectorAll(
      "section[id^='faq-cat-']",
    );
    const ids = Array.from(sections).map((s) => s.id);
    expect(ids).toEqual([
      "faq-cat-insumos",
      "faq-cat-tiempos",
      "faq-cat-servicios",
      "faq-cat-trabajos",
    ]);
  });

  it("renders a hidden peek icon behind every bubble", () => {
    const { container } = renderFaq();
    // Each bubble has a peek icon (aria-hidden).
    const hidden = container.querySelectorAll('img[aria-hidden="true"]');
    expect(hidden).toHaveLength(data.home.faqs.length);
  });

  describe("mobile peek dialog", () => {
    it("opens a sheet dialog with the tapped bubble's content when a peek button is clicked", async () => {
      const user = userEvent.setup();
      renderFaq();

      const peekButtons = screen.getAllByRole("button", {
        name: /ver respuesta/i,
      });
      expect(peekButtons).toHaveLength(data.home.faqs.length);

      await user.click(peekButtons[0]);

      const dialog = screen.getByRole("dialog");
      // Bubbles render grouped by category, starting with "insumos" — not
      // necessarily the first item in the flat faqs array.
      const first = data.home.faqs.find((f) => f.category === "insumos")!;
      expect(within(dialog).getByText(first.q)).toBeInTheDocument();
      expect(within(dialog).getByText(first.a)).toBeInTheDocument();
    });

    it("opens that bubble's own dialog (not a shared one) for any tapped bubble", async () => {
      const user = userEvent.setup();
      renderFaq();

      const peekButtons = screen.getAllByRole("button", {
        name: /ver respuesta/i,
      });

      await user.click(peekButtons[2]);

      const dialog = screen.getByRole("dialog");
      const third = data.home.faqs[2];
      expect(within(dialog).getByText(third.q)).toBeInTheDocument();
      expect(within(dialog).getByText(third.a)).toBeInTheDocument();
    });

    it("closes the dialog on ESC and returns focus to the peek button", async () => {
      const user = userEvent.setup();
      renderFaq();

      const peekButtons = screen.getAllByRole("button", {
        name: /ver respuesta/i,
      });
      await user.click(peekButtons[0]);
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      await user.keyboard("{Escape}");

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(peekButtons[0]).toHaveFocus();
    });

    it("closes the dialog when the backdrop is clicked", async () => {
      const user = userEvent.setup();
      renderFaq();

      const peekButtons = screen.getAllByRole("button", {
        name: /ver respuesta/i,
      });
      await user.click(peekButtons[0]);
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      // The Radix overlay backdrop carries the modal dimming classes.
      const backdrop = document.querySelector('[class*="bg-black/50"]');
      expect(backdrop).not.toBeNull();
      await user.click(backdrop as Element);

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
