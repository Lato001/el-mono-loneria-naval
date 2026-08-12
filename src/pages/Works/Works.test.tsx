import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Works } from "./Works";

vi.mock("../../components/ui/WorksSection/WorksSection", () => ({
  WorksSection: function MockWorksSection() {
    return (
      <div data-testid="works-section">
        <h1 data-testid="works-section-title">Nuestros Trabajos</h1>
        <p data-testid="works-section-eyebrow">Trabajos</p>
        <div data-testid="works-album">Más del taller</div>
      </div>
    );
  },
}));

function renderWorks() {
  return render(
    <MemoryRouter initialEntries={["/trabajos"]}>
      <Works />
    </MemoryRouter>,
  );
}

describe("Works page", () => {
  it("renders WorksSection component", () => {
    renderWorks();
    expect(screen.getByTestId("works-section")).toBeInTheDocument();
  });

  it("renders the showcase title and eyebrow via WorksSection", () => {
    renderWorks();
    expect(screen.getByTestId("works-section-title")).toHaveTextContent("Nuestros Trabajos");
    expect(screen.getByTestId("works-section-eyebrow")).toHaveTextContent("Trabajos");
  });

  it("renders the album section via WorksSection", () => {
    renderWorks();
    expect(screen.getByTestId("works-album")).toHaveTextContent("Más del taller");
  });
});