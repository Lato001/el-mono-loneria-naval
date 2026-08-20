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
  it("renders the page-level heading (h1) with the aboutUs title", () => {
    renderAboutUs();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: aboutUsData.title,
      }),
    ).toBeInTheDocument();
  });

  it("renders the 'Nuestro Taller' eyebrow", () => {
    renderAboutUs();
    // The eyebrow is rendered as a <p>; the CTA text also matches the regex,
    // so we filter by tag.
    const eyebrow = screen
      .getAllByText(/nuestro taller/i)
      .find((el) => el.tagName.toLowerCase() === "p");
    expect(eyebrow).toBeInTheDocument();
  });

  it("renders content text from data", () => {
    renderAboutUs();
    const paragraphs = screen.getAllByText(aboutUsData.content);
    expect(paragraphs.length).toBeGreaterThan(0);
  });

  it("renders highlights from data", () => {
    renderAboutUs();
    for (const highlight of aboutUsData.highlights!) {
      expect(screen.getByText(highlight.label)).toBeInTheDocument();
    }
  });

  it("renders one gallery image per gallery entry with its alt", () => {
    renderAboutUs();
    for (const { alt } of aboutUsData.gallery!) {
      expect(screen.getByAltText(alt)).toBeInTheDocument();
    }
  });

  it("renders exactly 4 gallery images (2 columns mobile / 4 desktop)", () => {
    renderAboutUs();
    const images = screen.getAllByRole("img", { hidden: false });
    expect(images).toHaveLength(aboutUsData.gallery!.length);
  });

  it("renders the NextPageCta linking to the next route in order", () => {
    renderAboutUs();
    // /nosotros -> /faq per NEXT_PATH_ORDER; the CTA shows the route label
    const nextLink = screen.getByRole("link", { name: /preguntas frecuentes/i });
    expect(nextLink).toHaveAttribute("href", "/faq");
  });
});
