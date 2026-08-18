import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { Navbar } from "./Navbar";

// framer-motion's exit animations don't settle deterministically in jsdom;
// render motion.div/AnimatePresence as plain DOM so state toggling is testable.
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
  },
  AnimatePresence: ({ children }: { children?: ReactNode }) => (
    <>{children}</>
  ),
}));

beforeEach(() => {
  Object.defineProperty(window, "scrollY", {
    value: 0,
    writable: true,
    configurable: true,
  });
});

function renderNavbar(initialEntry = "/") {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Navbar />
    </MemoryRouter>,
  );
}

describe("Navbar", () => {
  it("renders the brand logo images", () => {
    renderNavbar();
    expect(screen.getByAltText("El Mono")).toBeInTheDocument();
    expect(
      screen.getByAltText("El Mono Lonería Naval"),
    ).toBeInTheDocument();
  });

  it("renders all header nav links", () => {
    renderNavbar();
    for (const label of [
      "Inicio",
      "Productos",
      "Trabajos",
      "Nosotros",
      "FAQ",
      "Contacto",
    ]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it("marks the current route link as active", () => {
    renderNavbar("/productos");
    expect(screen.getByText("Productos")).toHaveClass("text-pr-aquamarine");
    expect(screen.getByText("Inicio")).not.toHaveClass("text-pr-aquamarine");
  });

  it("opens the mobile menu with nav links and the WhatsApp CTA", async () => {
    const user = userEvent.setup();
    renderNavbar();
    await user.click(screen.getByRole("button", { name: "Abrir menú" }));
    expect(
      screen.getAllByRole("button", { name: "Cerrar menú" }).length,
    ).toBeGreaterThan(0);
    expect(screen.getByText("Consultar por WhatsApp")).toBeInTheDocument();
    // Mobile duplicates the desktop links.
    expect(screen.getAllByText("Contacto")).toHaveLength(2);
  });

  it("closes the mobile menu when a link is clicked", async () => {
    const user = userEvent.setup();
    renderNavbar();
    await user.click(screen.getByRole("button", { name: "Abrir menú" }));
    await user.click(screen.getAllByText("FAQ")[1]);
    expect(
      screen.queryAllByRole("button", { name: "Cerrar menú" }),
    ).toHaveLength(0);
  });

  it("starts solid (not frosted) at the top of the page", () => {
    renderNavbar();
    const header = screen.getByRole("banner");
    expect(header.className).toContain("from-sc-ocean-blue");
    expect(header.className).toContain("to-pr-aquamarine");
    expect(header.className).not.toContain("backdrop-blur-xl");
  });

  it("frosts the pill when scrolling down", () => {
    renderNavbar();
    Object.defineProperty(window, "scrollY", {
      value: 100,
      writable: true,
      configurable: true,
    });
    fireEvent.scroll(window);
    const header = screen.getByRole("banner");
    expect(header.className).toContain("backdrop-blur-xl");
  });
});
