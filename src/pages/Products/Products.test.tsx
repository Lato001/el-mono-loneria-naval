import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { Products } from "./Products";

// Mock useFadeInOnView to avoid IntersectionObserver complexity
vi.mock("../../hooks/useFadeInOnView", () => ({
  useFadeInOnView: () => ({ ref: { current: null }, visible: true }),
}));

// Set VITE_WHATSAPP_URL for tests
beforeAll(() => {
  Object.defineProperty(import.meta, "env", {
    value: {
      VITE_WHATSAPP_URL: "https://wa.me/5491156137150?text=Hola",
    },
    writable: true,
  });
});

function renderProducts() {
  return render(
    <MemoryRouter initialEntries={["/productos"]}>
      <Products />
    </MemoryRouter>,
  );
}

describe("Products page", () => {
  it("renders the hero heading", () => {
    renderProducts();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Nuestros productos");
  });

  it("renders 4 category tabs", () => {
    renderProducts();
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(4);
  });

  it("renders 4 carousel sections (tabpanels)", () => {
    renderProducts();
    const panels = screen.getAllByRole("tabpanel");
    expect(panels).toHaveLength(4);
  });

  it("opens quotation modal when card CTA is clicked", async () => {
    const user = userEvent.setup();
    renderProducts();

    // Find the first "Cotizar" button (Card CTA)
    const cotizarButtons = screen.getAllByLabelText("Cotizar");
    expect(cotizarButtons.length).toBeGreaterThan(0);

    await user.click(cotizarButtons[0]);

    // Modal should be open with the product title
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Cotizar producto")).toBeInTheDocument();
  });

  it("WhatsApp link includes product name", async () => {
    const user = userEvent.setup();
    renderProducts();

    const cotizarButtons = screen.getAllByLabelText("Cotizar");
    await user.click(cotizarButtons[0]);

    const whatsappLink = screen.getByText("Consultar por WhatsApp");
    expect(whatsappLink.closest("a")).toHaveAttribute(
      "href",
      expect.stringContaining("wa.me"),
    );
  });

  it('"Seguir viendo" closes the modal', async () => {
    const user = userEvent.setup();
    renderProducts();

    const cotizarButtons = screen.getAllByLabelText("Cotizar");
    await user.click(cotizarButtons[0]);

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByText("Seguir viendo"));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("Escape closes the modal", async () => {
    const user = userEvent.setup();
    renderProducts();

    const cotizarButtons = screen.getAllByLabelText("Cotizar");
    await user.click(cotizarButtons[0]);

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
