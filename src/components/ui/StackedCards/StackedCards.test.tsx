import { render, screen } from "@testing-library/react";
import { StackedCards } from "./StackedCards";

const cards = [
  {
    id: "c1",
    image: "/card1.jpg",
    alt: "Carta uno",
    title: "Título uno",
    description: "Descripción uno",
  },
  { id: "c2", image: "/card2.jpg", alt: "Carta dos", title: "Título dos" },
  { id: "c3", image: "/card3.jpg", alt: "Carta tres" },
];

describe("StackedCards", () => {
  it("renders every card with its image", () => {
    render(<StackedCards cards={cards} />);
    expect(screen.getByAltText("Carta uno")).toBeInTheDocument();
    expect(screen.getByAltText("Carta dos")).toBeInTheDocument();
    expect(screen.getByAltText("Carta tres")).toBeInTheDocument();
  });

  it("renders titles and descriptions when provided", () => {
    render(<StackedCards cards={cards} />);
    expect(screen.getByText("Título uno")).toBeInTheDocument();
    expect(screen.getByText("Descripción uno")).toBeInTheDocument();
    expect(screen.getByText("Título dos")).toBeInTheDocument();
  });

  it("omits the title element for cards without one", () => {
    render(<StackedCards cards={cards} />);
    expect(screen.queryByText("Título tres")).not.toBeInTheDocument();
  });

  it("keeps the front card last in the stack order", () => {
    const { container } = render(<StackedCards cards={cards} />);
    // Front card has the highest zIndex (matches its array index).
    const top = container.querySelector('[style*="z-index: 2"]');
    expect(top).not.toBeNull();
    expect(top!.querySelector("img")).toHaveAttribute("alt", "Carta tres");
  });
});
