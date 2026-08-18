import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { Header } from "./Header";

// Header renders Navbar, which uses framer-motion's AnimatePresence/motion
// components. Render them as plain DOM for deterministic state assertions.
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
  },
  AnimatePresence: ({ children }: { children?: ReactNode }) => (
    <>{children}</>
  ),
}));

function renderHeader() {
  return render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>,
  );
}

describe("Header", () => {
  it("renders the navbar brand", () => {
    renderHeader();
    expect(screen.getByAltText("El Mono")).toBeInTheDocument();
  });

  it("renders the navigation links", () => {
    renderHeader();
    for (const label of ["Productos", "Trabajos", "Contacto"]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it("opens the mobile menu on hamburger click", async () => {
    const user = userEvent.setup();
    renderHeader();
    await user.click(screen.getByRole("button", { name: "Abrir menú" }));
    expect(screen.getByText("Consultar por WhatsApp")).toBeInTheDocument();
  });

  it("closes the mobile menu via its close button", async () => {
    const user = userEvent.setup();
    renderHeader();
    await user.click(screen.getByRole("button", { name: "Abrir menú" }));
    await user.click(
      screen.getAllByRole("button", { name: "Cerrar menú" })[1],
    );
    // The X button is gone and the hamburger reverted to "Abrir menú".
    expect(
      screen.queryAllByRole("button", { name: "Cerrar menú" }),
    ).toHaveLength(0);
  });
});
