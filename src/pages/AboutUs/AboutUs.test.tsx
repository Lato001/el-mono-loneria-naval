import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AboutUs } from "./AboutUs";
import { data } from "../../mocks/data";

// Mock useFadeInOnView to avoid IntersectionObserver complexity
vi.mock("../../hooks/useFadeInOnView", () => ({
  useFadeInOnView: () => ({ ref: { current: null }, visible: true }),
}));

const aboutUsData = data.home.aboutUsSection;

function renderAboutUs() {
  return render(
    <MemoryRouter initialEntries={["/nosotros"]}>
      <AboutUs />
    </MemoryRouter>,
  );
}

describe("AboutUs page", () => {
  it("renders SectionHero with the aboutUs eyebrow and title", () => {
    renderAboutUs();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: aboutUsData.title,
      }),
    ).toBeInTheDocument();
  });

  it("renders SectionHero with the page description", () => {
    renderAboutUs();
    expect(
      screen.getByText(/conocé nuestra historia/i),
    ).toBeInTheDocument();
  });

  it("renders AboutSection content paragraphs from data", () => {
    renderAboutUs();
    for (const paragraph of aboutUsData.content) {
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    }
  });

  it("renders AboutSection highlights from data", () => {
    renderAboutUs();
    for (const highlight of aboutUsData.highlights!) {
      expect(screen.getByText(highlight.value)).toBeInTheDocument();
      expect(screen.getByText(highlight.label)).toBeInTheDocument();
    }
  });

  it("renders AboutSection CTA with the correct href", () => {
    renderAboutUs();
    const cta = aboutUsData.cta!;
    const ctaLink = screen.getByRole("link", { name: new RegExp(cta.text, "i") });
    expect(ctaLink).toBeInTheDocument();
    expect(ctaLink).toHaveAttribute("href", cta.href);
  });
});
