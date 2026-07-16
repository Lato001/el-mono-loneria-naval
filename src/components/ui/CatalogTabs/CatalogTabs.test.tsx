import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CatalogTabs } from "./CatalogTabs";
import type { Tab } from "./CatalogTabs.types";

const categories: Tab[] = [
  { id: "broches", name: "Broches" },
  { id: "caballetes", name: "Caballetes" },
  { id: "cierres", name: "Cierres" },
  { id: "hilos", name: "Hilos" },
];

const defaultProps = {
  selectedCount: 0,
  onPresupuestar: vi.fn(),
  presupuestarDisabled: true,
};

describe("CatalogTabs", () => {
  it("renders one tab per category", () => {
    render(<CatalogTabs categories={categories} {...defaultProps} />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(4);
    expect(tabs[0]).toHaveTextContent("Broches");
    expect(tabs[3]).toHaveTextContent("Hilos");
  });

  it("marks the active tab with aria-selected", () => {
    render(<CatalogTabs categories={categories} activeId="caballetes" {...defaultProps} />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs[0]).toHaveAttribute("aria-selected", "false");
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
  });

  it("calls onSelect when a tab is clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<CatalogTabs categories={categories} onSelect={onSelect} {...defaultProps} />);

    await user.click(screen.getByText("Cierres"));
    expect(onSelect).toHaveBeenCalledWith("cierres");
  });

  it("ArrowRight moves focus and selects next tab (wraps)", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <CatalogTabs categories={categories} activeId="broches" onSelect={onSelect} {...defaultProps} />,
    );

    const firstTab = screen.getByText("Broches");
    firstTab.focus();
    await user.keyboard("{ArrowRight}");

    expect(onSelect).toHaveBeenCalledWith("caballetes");
  });

  it("ArrowLeft moves focus and selects previous tab (wraps)", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <CatalogTabs categories={categories} activeId="broches" onSelect={onSelect} {...defaultProps} />,
    );

    const firstTab = screen.getByText("Broches");
    firstTab.focus();
    await user.keyboard("{ArrowLeft}");

    expect(onSelect).toHaveBeenCalledWith("hilos");
  });

  it("Home jumps to first tab", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <CatalogTabs categories={categories} activeId="cierres" onSelect={onSelect} {...defaultProps} />,
    );

    const activeTab = screen.getByText("Cierres");
    activeTab.focus();
    await user.keyboard("{Home}");

    expect(onSelect).toHaveBeenCalledWith("broches");
  });

  it("End jumps to last tab", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <CatalogTabs categories={categories} activeId="broches" onSelect={onSelect} {...defaultProps} />,
    );

    const firstTab = screen.getByText("Broches");
    firstTab.focus();
    await user.keyboard("{End}");

    expect(onSelect).toHaveBeenCalledWith("hilos");
  });

  it("has correct aria-controls linking to section id", () => {
    render(<CatalogTabs categories={categories} activeId="broches" {...defaultProps} />);
    const brochesTab = screen.getByText("Broches");
    expect(brochesTab).toHaveAttribute("aria-controls", "broches");
  });

  it("sets tabIndex=0 on active tab and -1 on inactive", () => {
    render(<CatalogTabs categories={categories} activeId="caballetes" {...defaultProps} />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs[0]).toHaveAttribute("tabindex", "-1");
    expect(tabs[1]).toHaveAttribute("tabindex", "0");
  });

  // T6 new tests
  it("renders Presupuestar button disabled when presupuestarDisabled is true", () => {
    render(<CatalogTabs categories={categories} {...defaultProps} presupuestarDisabled={true} />);
    const button = screen.getByRole("button", { name: /presupuestar/i });
    expect(button).toBeDisabled();
  });

  it("renders Presupuestar button enabled when presupuestarDisabled is false", () => {
    render(
      <CatalogTabs categories={categories} {...defaultProps} selectedCount={2} presupuestarDisabled={false} />,
    );
    const button = screen.getByRole("button", { name: /presupuestar/i });
    expect(button).not.toBeDisabled();
  });

  it("calls onPresupuestar when the button is clicked", async () => {
    const user = userEvent.setup();
    const onPresupuestar = vi.fn();
    render(
      <CatalogTabs
        categories={categories}
        selectedCount={3}
        onPresupuestar={onPresupuestar}
        presupuestarDisabled={false}
      />,
    );

    await user.click(screen.getByRole("button", { name: /presupuestar/i }));
    expect(onPresupuestar).toHaveBeenCalled();
  });
});
