import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { Services } from "./Services";
import { data } from "../../mocks/data";
import type { ServiceSection } from "../../mocks/types";

// Mock useFadeInOnView to avoid IntersectionObserver complexity
vi.mock("../../hooks/useFadeInOnView", () => ({
  useFadeInOnView: () => ({ ref: { current: null }, visible: true }),
}));

function renderServices() {
  return render(
    <MemoryRouter initialEntries={["/servicios"]}>
      <Services />
    </MemoryRouter>,
  );
}

describe("Services page", () => {
  const contentByTab = data.servicesPage.content as Record<string, ServiceSection>;

  it("renders the page-level heading (h1) with the services title and description", () => {
    renderServices();
    expect(
      screen.getByRole("heading", { level: 1, name: data.ui.servicesHeroTitle }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(data.ui.servicesHeroDescription),
    ).toBeInTheDocument();
  });

  it("renders one tab per service category", () => {
    renderServices();
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(data.servicesPage.tabs.length);
  });

  it("uses the services categories aria-label on the tablist", () => {
    renderServices();
    const tablist = screen.getByRole("tablist");
    expect(tablist).toHaveAttribute(
      "aria-label",
      data.ui.servicesCategoriesLabel,
    );
  });

  it("defaults the active tab to the first one on initial render", () => {
    renderServices();
    const firstTab = data.servicesPage.tabs[0];
    // The SectionWrapper shows the active tab's name as its title.
    expect(
      screen.getByRole("heading", { level: 2, name: firstTab.name }),
    ).toBeInTheDocument();
    const activeTab = screen.getByRole("tab", { name: firstTab.name });
    expect(activeTab).toHaveAttribute("aria-selected", "true");
  });

  it("updates the SectionWrapper title and the active tab when a tab is clicked", async () => {
    const user = userEvent.setup();
    renderServices();
    const secondTab = data.servicesPage.tabs[1];

    // Click the second tab.
    await user.click(screen.getByRole("tab", { name: secondTab.name }));

    // SectionWrapper title now reflects the new active tab.
    expect(
      screen.getByRole("heading", { level: 2, name: secondTab.name }),
    ).toBeInTheDocument();
    // Previous tab is no longer selected.
    const firstTab = data.servicesPage.tabs[0];
    expect(
      screen.getByRole("tab", { name: firstTab.name }),
    ).toHaveAttribute("aria-selected", "false");
    expect(
      screen.getByRole("tab", { name: secondTab.name }),
    ).toHaveAttribute("aria-selected", "true");
  });

  it("renders one carousel card per item of the active tab", () => {
    renderServices();
    const firstTab = data.servicesPage.tabs[0];
    const firstContent = contentByTab[firstTab.id];
    for (const item of firstContent.items) {
      // Each item is rendered as an <article> with its title as a heading.
      expect(
        screen.getByRole("heading", { name: item.title }),
      ).toBeInTheDocument();
    }
  });

  it("swaps the carousel items when a tab is clicked", async () => {
    const user = userEvent.setup();
    renderServices();
    const firstTab = data.servicesPage.tabs[0];
    const firstContent = contentByTab[firstTab.id];
    const secondTab = data.servicesPage.tabs[1];
    const secondContent = contentByTab[secondTab.id];

    // First tab items are visible.
    for (const item of firstContent.items) {
      expect(
        screen.getByRole("heading", { name: item.title }),
      ).toBeInTheDocument();
    }

    // Switch to the second tab.
    await user.click(screen.getByRole("tab", { name: secondTab.name }));

    // Second tab items are now visible, first tab items are gone.
    for (const item of secondContent.items) {
      expect(
        screen.getByRole("heading", { name: item.title }),
      ).toBeInTheDocument();
    }
    for (const item of firstContent.items) {
      expect(
        screen.queryByRole("heading", { name: item.title }),
      ).not.toBeInTheDocument();
    }
  });
});
