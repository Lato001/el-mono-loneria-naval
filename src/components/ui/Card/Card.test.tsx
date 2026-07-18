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

  it("renders the selection pill at top-right with always-navy background", () => {
    render(<Card title="Broche Test" onSelectChange={() => {}} />);
    const checkbox = screen.getByRole("checkbox", { hidden: true });
    const pill = checkbox.closest("label");
    expect(pill).not.toBeNull();
    expect(pill!.className).toContain("absolute");
    expect(pill!.className).toContain("top-3");
    expect(pill!.className).toContain("right-3");
    expect(pill!.className).toContain("rounded-full");
    expect(pill!.className).toContain("bg-sc-ocean-blue");
    expect(pill!.className).toContain("h-11");
  });

  it("centers the + icon in the pill when unselected (w-8 + justify-center + gap-0)", () => {
    render(<Card title="Broche Test" onSelectChange={() => {}} />);
    const checkbox = screen.getByRole("checkbox", { hidden: true });
    const pill = checkbox.closest("label");
    expect(pill!.className).toContain("w-8");
    expect(pill!.className).toContain("justify-center");
    expect(pill!.className).toContain("gap-0");
  });

  it("anchors the × icon at the left of the pill when selected (justify-start + gap-2 + pl-1 + pr-3)", () => {
    render(<Card title="Broche Test" selected={true} onSelectChange={() => {}} />);
    const checkbox = screen.getByRole("checkbox", { hidden: true });
    const pill = checkbox.closest("label");
    expect(pill!.className).toContain("justify-start");
    expect(pill!.className).toContain("gap-2");
    expect(pill!.className).toContain("pl-1");
    expect(pill!.className).toContain("pr-3");
    expect(pill!.className).not.toContain("w-8");
  });

  it("shows the + icon (IconPlus) when unselected and the × icon (IconX) when selected, at h-5 w-5 (20px)", () => {
    const { rerender, container } = render(
      <Card title="Broche Test" onSelectChange={() => {}} />,
    );
    const plusIcon = container.querySelector(".tabler-icon-plus");
    expect(plusIcon).toBeInTheDocument();
    expect(plusIcon).toHaveClass("h-5");
    expect(plusIcon).toHaveClass("w-5");
    expect(container.querySelector(".tabler-icon-x")).not.toBeInTheDocument();

    rerender(<Card title="Broche Test" selected={true} onSelectChange={() => {}} />);
    const xIcon = container.querySelector(".tabler-icon-x");
    expect(container.querySelector(".tabler-icon-plus")).not.toBeInTheDocument();
    expect(xIcon).toBeInTheDocument();
    expect(xIcon).toHaveClass("h-5");
    expect(xIcon).toHaveClass("w-5");
  });

  it("keeps the native checkbox accessible via sr-only (for screen readers and click handling)", () => {
    render(<Card title="Broche Test" onSelectChange={() => {}} />);
    const checkbox = screen.getByRole("checkbox", { hidden: true });
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
    expect(checkbox.className).toContain("sr-only");
  });

  it("hides the 'Seleccionado' text when not selected (collapsed pill)", () => {
    render(<Card title="Broche Test" onSelectChange={() => {}} />);
    const text = screen.getByText("Seleccionado");
    expect(text.className).toContain("opacity-0");
    expect(text.className).toContain("max-w-0");
    expect(text.className).toContain("text-white");
    expect(text.getAttribute("aria-hidden")).toBe("true");
  });

  it("shows the white 'Seleccionado' text on the navy pill when selected (unfolded pill)", () => {
    render(<Card title="Broche Test" selected={true} onSelectChange={() => {}} />);
    const checkbox = screen.getByRole("checkbox");
    const pill = checkbox.closest("label");
    expect(pill!.className).toContain("bg-sc-ocean-blue");
    const text = screen.getByText("Seleccionado");
    expect(text.className).toContain("opacity-100");
    expect(text.className).toContain("max-w-[7.5rem]");
    expect(text.className).toContain("text-white");
  });

  it("keeps the aquamarine ring on the card when selected (card visual unchanged)", () => {
    render(<Card title="Broche Test" selected={true} onSelectChange={() => {}} />);
    const article = screen.getByRole("article");
    expect(article.className).toContain("ring-pr-aquamarine");
    expect(article.className).toContain("border-pr-aquamarine");
  });
});
