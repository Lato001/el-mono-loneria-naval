import { render, screen } from "@testing-library/react";
import { SplitReviews } from "./SplitReviews";

describe("SplitReviews", () => {
  it("renders up to three reviews from the mock data", () => {
    render(<SplitReviews />);
    expect(screen.getAllByRole("article")).toHaveLength(3);
  });

  it("renders the review authors", () => {
    render(<SplitReviews />);
    expect(screen.getByText("Enrique Gómez")).toBeInTheDocument();
    expect(screen.getByText("German Villanueva")).toBeInTheDocument();
    expect(screen.getByText("Lautaro Couceiro")).toBeInTheDocument();
  });

  it("renders the review titles", () => {
    render(<SplitReviews />);
    expect(screen.getByText("Excelente Trabajo")).toBeInTheDocument();
    expect(screen.getByText("En Tiempo y Forma")).toBeInTheDocument();
  });
});
