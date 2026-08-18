import { render, screen } from "@testing-library/react";
import { ReviewCard } from "./ReviewCard";

describe("ReviewCard", () => {
  it("renders author, title and description", () => {
    render(
      <ReviewCard
        id="r1"
        author="Enrique Gómez"
        title="Excelente Trabajo"
        stars={5}
        description="Trabajos rápidos y acorde con precios"
      />,
    );
    expect(screen.getByText("Enrique Gómez")).toBeInTheDocument();
    expect(screen.getByRole("heading")).toHaveTextContent("Excelente Trabajo");
    expect(
      screen.getByText("Trabajos rápidos y acorde con precios"),
    ).toBeInTheDocument();
  });

  it("renders the avatar image with the author as alt when provided", () => {
    render(
      <ReviewCard
        id="r1"
        author="Enrique Gómez"
        title="Título"
        stars={5}
        description="Descripción"
        avatar="/avatar.jpg"
      />,
    );
    const img = screen.getByAltText("Enrique Gómez");
    expect(img).toHaveAttribute("src", "/avatar.jpg");
  });

  it("falls back to the author's initial when no avatar is provided", () => {
    render(
      <ReviewCard
        id="r2"
        author="german"
        title="Título"
        stars={5}
        description="Descripción"
      />,
    );
    expect(screen.getByText("G")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders five star icons", () => {
    const { container } = render(
      <ReviewCard
        id="r1"
        author="Autor"
        title="Título"
        stars={5}
        description="Descripción"
      />,
    );
    expect(container.querySelectorAll(".tabler-icon-star-filled")).toHaveLength(
      5,
    );
  });
});
