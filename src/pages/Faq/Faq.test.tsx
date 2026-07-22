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

  it("renders 3 FAQ bubbles with the first 3 questions from data", () => {
    renderFaq();
    for (const bubble of bubbles) {
      // The question is rendered as a heading.
      expect(
        screen.getByRole("heading", { level: 2, name: bubble.q }),
      ).toBeInTheDocument();
      // The answer is rendered as a paragraph.
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
    // Each bubble renders a wrapping div with the alignment in its className.
    // We assert on the alignment classes directly (a behavioral proxy: the
    // classes ARE the contract for this flex layout).
    const bubbleWrappers = container.querySelectorAll(
      "div.flex.w-full.flex-col.gap-6",
    );
    expect(bubbleWrappers).toHaveLength(3);
    for (let i = 0; i < aligns.length; i++) {
      const expected = aligns[i] === "start" ? "items-start" : "items-end";
      expect(bubbleWrappers[i].className).toContain(expected);
    }
  });
});
