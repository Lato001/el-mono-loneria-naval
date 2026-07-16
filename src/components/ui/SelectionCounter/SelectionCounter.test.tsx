import { render, screen } from "@testing-library/react";
import { SelectionCounter } from "./SelectionCounter";

describe("SelectionCounter", () => {
  it("renders nothing when count is 0", () => {
    const { container } = render(<SelectionCounter count={0} />);
    expect(container.firstChild).toBeNull();
    expect(screen.queryByLabelText(/productos seleccionados/i)).not.toBeInTheDocument();
  });

  it("renders the count number when count > 0", () => {
    render(<SelectionCounter count={3} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("has aria-live polite attribute", () => {
    render(<SelectionCounter count={5} />);
    const badge = screen.getByLabelText(/productos seleccionados/i);
    expect(badge).toHaveAttribute("aria-live", "polite");
  });
});
