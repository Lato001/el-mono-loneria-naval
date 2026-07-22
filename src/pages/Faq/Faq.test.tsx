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

describe("Faq page", () => {
  const faqSection = data.home.sections.faq;
  const faqs = data.home.faqs;

  it("renders the SectionHero with the FAQ title", () => {
    renderFaq();
    expect(
      screen.getByRole("heading", { level: 1, name: faqSection.title }),
    ).toBeInTheDocument();
  });

  it("renders the eyebrow above the title", () => {
    renderFaq();
    expect(screen.getByText(faqSection.eyebrow)).toBeInTheDocument();
  });

  it("renders all FAQ questions as accordion triggers", () => {
    renderFaq();
    for (const faq of faqs) {
      expect(
        screen.getByRole("button", { name: faq.q }),
      ).toBeInTheDocument();
    }
    expect(screen.getAllByRole("button", { name: /.+/ })).toHaveLength(
      faqs.length,
    );
  });

  it("opens an accordion item on click and shows the answer", async () => {
    const user = userEvent.setup();
    renderFaq();
    const firstFaq = faqs[0];

    // Answer should not be in the DOM before clicking (Radix collapses by removing content).
    expect(screen.queryByText(firstFaq.a)).not.toBeInTheDocument();

    // Click the trigger to expand.
    await user.click(
      screen.getByRole("button", { name: firstFaq.q }),
    );

    // Answer is now visible.
    expect(screen.getByText(firstFaq.a)).toBeVisible();
  });
});
