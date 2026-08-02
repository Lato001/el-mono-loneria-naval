import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SectionTabs } from "./SectionTabs";
import type { Tab } from "./SectionTabs.types";

const categories: Tab[] = [
  { id: "broches", name: "Broches" },
  { id: "caballetes", name: "Caballetes" },
  { id: "cierres", name: "Cierres" },
  { id: "hilos", name: "Hilos" },
];

describe("SectionTabs", () => {
  it("renders one tab per category", () => {
    render(<SectionTabs categories={categories} />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(4);
    expect(tabs[0]).toHaveTextContent("Broches");
    expect(tabs[3]).toHaveTextContent("Hilos");
  });

  it("marks the active tab with aria-selected", () => {
    render(<SectionTabs categories={categories} activeId="caballetes" />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs[0]).toHaveAttribute("aria-selected", "false");
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
  });

  it("calls onSelect when a tab is clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<SectionTabs categories={categories} onSelect={onSelect} />);

    await user.click(screen.getByText("Cierres"));
    expect(onSelect).toHaveBeenCalledWith("cierres");
  });

  it("ArrowRight moves focus and selects next tab (wraps)", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <SectionTabs categories={categories} activeId="broches" onSelect={onSelect} />,
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
      <SectionTabs categories={categories} activeId="broches" onSelect={onSelect} />,
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
      <SectionTabs categories={categories} activeId="cierres" onSelect={onSelect} />,
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
      <SectionTabs categories={categories} activeId="broches" onSelect={onSelect} />,
    );

    const firstTab = screen.getByText("Broches");
    firstTab.focus();
    await user.keyboard("{End}");

    expect(onSelect).toHaveBeenCalledWith("hilos");
  });

  it("has correct aria-controls linking to section id", () => {
    render(<SectionTabs categories={categories} activeId="broches" />);
    const brochesTab = screen.getByText("Broches");
    expect(brochesTab).toHaveAttribute("aria-controls", "broches");
  });

  it("sets tabIndex=0 on active tab and -1 on inactive", () => {
    render(<SectionTabs categories={categories} activeId="caballetes" />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs[0]).toHaveAttribute("tabindex", "-1");
    expect(tabs[1]).toHaveAttribute("tabindex", "0");
  });

  it("tablist is not sticky and has no inline top style", () => {
    render(<SectionTabs categories={categories} />);
    const tablist = screen.getByRole("tablist");
    expect(tablist.className).not.toContain("sticky");
    expect(tablist.className).not.toContain("z-40");
    expect(tablist.style.top).toBe("");
  });
});
