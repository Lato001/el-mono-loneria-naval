import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Works } from "./Works";
import { data } from "../../mocks/data";

vi.mock("../../components/ui/Masonry/Masonry", () => ({
  default: function MockMasonry({ items }: { items: { alt: string }[] }) {
    return (
      <div data-testid="masonry">
        {items.map((item) => (
          <img key={item.alt} alt={item.alt} src="" />
        ))}
      </div>
    );
  },
}));

vi.mock("../../hooks/useFadeInOnView", () => ({
  useFadeInOnView: () => ({ ref: { current: null }, visible: true }),
}));

function renderWorks() {
  return render(
    <MemoryRouter initialEntries={["/trabajos"]}>
      <Works />
    </MemoryRouter>,
  );
}

describe("Works page", () => {
  it("renders the SectionWrapper with the correct eyebrow and title", () => {
    renderWorks();
    expect(screen.getByText("Album de fotos")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Nuestros Trabajos" })).toBeInTheDocument();
  });

  it("passes all album images to the Masonry component", () => {
    renderWorks();
    const masonry = screen.getByTestId("masonry");
    const images = masonry.querySelectorAll("img");
    expect(images).toHaveLength(data.worksPage.album.images.length);
  });

  it("renders each album image with its alt text", () => {
    renderWorks();
    for (const img of data.worksPage.album.images) {
      expect(screen.getByAltText(img.alt)).toBeInTheDocument();
    }
  });
});
