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
});
