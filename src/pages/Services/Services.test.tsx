import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { Services } from "./Services";
import { data } from "../../mocks/data";

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
  it("renders the hero with the services title and description", () => {
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

  it("renders a content section for every service tab", () => {
    renderServices();
    for (const tab of data.servicesPage.tabs) {
      const section = document.getElementById(tab.id);
      expect(section).toBeInTheDocument();
      expect(section?.tagName).toBe("SECTION");
      const content = data.servicesPage.content[tab.id];
      expect(
        screen.getByRole("heading", { level: 2, name: content.title }),
      ).toBeInTheDocument();
    }
  });

  it("scrolls to the corresponding section when a tab is clicked", async () => {
    const user = userEvent.setup();
    // Mock scrollIntoView on every element so we can spy on the call.
    const original = HTMLElement.prototype.scrollIntoView;
    HTMLElement.prototype.scrollIntoView = vi.fn();

    try {
      renderServices();
      // Click the second tab (Cerramientos) — scope to tablist so we
      // don't match the h2 in the content section below.
      const tablist = screen.getByRole("tablist");
      await user.click(screen.getByRole("tab", { name: "Cerramientos" }));
      const target = document.getElementById("cerramientos");
      expect(target).not.toBeNull();
      expect(target!.scrollIntoView).toHaveBeenCalledWith({
        behavior: "smooth",
      });
    } finally {
      HTMLElement.prototype.scrollIntoView = original;
    }
  });
});
