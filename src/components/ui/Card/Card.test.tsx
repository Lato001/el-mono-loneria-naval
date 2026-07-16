import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Card } from "./Card";

describe("Card", () => {
  it("renders aquamarine ring when selected is true", () => {
    render(<Card title="Test" selected={true} />);
    const article = screen.getByRole("article");
    expect(article.className).toContain("ring-pr-aquamarine");
    expect(article.className).toContain("ring-2");
  });

  it("renders a checkbox when onSelectChange is provided", async () => {
    const user = userEvent.setup();
    const onSelectChange = vi.fn();
    render(<Card title="Test" onSelectChange={onSelectChange} />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(onSelectChange).toHaveBeenCalledWith(true);
  });

  it("renders without checkbox or ring when selection props are absent (Home-safe)", () => {
    render(<Card title="Home Card" description="Some desc" imageSrc="/test.jpg" />);
    const article = screen.getByRole("article");
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    expect(article.className).not.toContain("ring-pr-aquamarine");
  });

  it("renders the selection pill at top-left with rounded-full shape", () => {
    render(<Card title="Broche Test" onSelectChange={() => {}} />);
    const checkbox = screen.getByRole("checkbox");
    const pill = checkbox.closest("label");
    expect(pill).not.toBeNull();
    expect(pill!.className).toContain("absolute");
    expect(pill!.className).toContain("top-3");
    expect(pill!.className).toContain("left-3");
    expect(pill!.className).toContain("rounded-full");
  });

  it("hides the 'Seleccionado' text when not selected (unfolded pill)", () => {
    render(<Card title="Broche Test" onSelectChange={() => {}} />);
    const text = screen.getByText("Seleccionado");
    expect(text.className).toContain("opacity-0");
    expect(text.className).toContain("max-w-0");
    expect(text.getAttribute("aria-hidden")).toBe("true");
  });

  it("shows the 'Seleccionado' text when selected (unfolded pill)", () => {
    render(<Card title="Broche Test" selected={true} onSelectChange={() => {}} />);
    const text = screen.getByText("Seleccionado");
    expect(text.className).toContain("opacity-100");
    expect(text.className).toContain("max-w-[7.5rem]");
  });
});
