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

  it("centers the + icon in the pill when unselected (w-11 + h-11 = circular + justify-center + gap-0)", () => {
    render(<Card title="Broche Test" onSelectChange={() => {}} />);
    const checkbox = screen.getByRole("checkbox", { hidden: true });
    const pill = checkbox.closest("label");
    expect(pill!.className).toContain("w-11");
    expect(pill!.className).toContain("h-11");
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
    // When selected, w-11 is overridden by !w-auto so the pill sizes to content
    expect(pill!.className).not.toMatch(/\bw-11\b/);
  });

  it("shows the + icon (IconPlus) when unselected and the × icon (IconX) when selected", () => {
    const { rerender, container } = render(
      <Card title="Broche Test" onSelectChange={() => {}} />,
    );
    const plusIcon = container.querySelector(".tabler-icon-plus");
    expect(plusIcon).toBeInTheDocument();
    expect(plusIcon).toHaveClass("text-sc-chalk");
    expect(plusIcon).not.toHaveClass("h-5");
    expect(plusIcon).not.toHaveClass("w-5");
    expect(container.querySelector(".tabler-icon-x")).not.toBeInTheDocument();

    rerender(<Card title="Broche Test" selected={true} onSelectChange={() => {}} />);
    const xIcon = container.querySelector(".tabler-icon-x");
    expect(container.querySelector(".tabler-icon-plus")).not.toBeInTheDocument();
    expect(xIcon).toBeInTheDocument();
    expect(xIcon).toHaveClass("text-sc-chalk");
    expect(xIcon).not.toHaveClass("h-5");
    expect(xIcon).not.toHaveClass("w-5");
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
    expect(text.className).toContain("text-sc-chalk");
    expect(text.getAttribute("aria-hidden")).toBe("true");
  });

  it("shows the chalk 'Seleccionado' text on the navy pill when selected (unfolded pill)", () => {
    render(<Card title="Broche Test" selected={true} onSelectChange={() => {}} />);
    const checkbox = screen.getByRole("checkbox");
    const pill = checkbox.closest("label");
    expect(pill!.className).toContain("bg-sc-ocean-blue");
    const text = screen.getByText("Seleccionado");
    expect(text.className).toContain("opacity-100");
    expect(text.className).toContain("max-w-30");
    expect(text.className).toContain("text-sc-chalk");
  });

  it("keeps the aquamarine ring on the card when selected (card visual unchanged)", () => {
    render(<Card title="Broche Test" selected={true} onSelectChange={() => {}} />);
    const article = screen.getByRole("article");
    expect(article.className).toContain("ring-pr-aquamarine");
    expect(article.className).toContain("ring-2");
    expect(article.className).toContain("bg-white/80");
  });

  it("fills its container height via h-full for equal-height rows", () => {
    render(<Card title="Broche Test" description="Some description" />);
    const article = screen.getByRole("article");
    expect(article.className).toContain("h-full");
    expect(article.style.height).toBe("");
    expect(article.className).not.toContain("md:h-auto");
  });

  it("scales the title responsively via text-lg md:text-xl and renders it complete", () => {
    render(<Card title="A long title that wraps instead of clamping" />);
    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading.className).toContain("text-lg");
    expect(heading.className).toContain("md:text-xl");
    expect(heading.className).not.toContain("line-clamp-1");
    expect(heading).toHaveTextContent(
      "A long title that wraps instead of clamping",
    );
  });

  it("truncates the description to two lines via line-clamp-2", () => {
    render(<Card title="Test" description="A long description that should wrap and get truncated after two lines" />);
    const article = screen.getByRole("article");
    const description = article.querySelector("p");
    expect(description).not.toBeNull();
    expect(description!.className).toContain("line-clamp-2");
  });
});
