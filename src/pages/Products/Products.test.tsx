import { render, screen, within } from "@testing-library/react";
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

beforeEach(() => {
  window.sessionStorage.clear();
});

function renderProducts() {
  return render(
    <MemoryRouter initialEntries={["/productos"]}>
      <Products />
    </MemoryRouter>,
  );
}

// ActionBar renders Presupuestar/Borrar/counter, so queries must be scoped
// to avoid "found multiple elements" errors (e.g. Borrar lista button in
// the action bar vs. the same name in the confirmation modal).
// `hidden: true` because Radix sets aria-hidden on page content while a
// Dialog is open, and the bar is reachable for assertions anyway.
const getActionBar = () =>
  screen.getByRole("region", {
    name: /Acciones del presupuesto/i,
    hidden: true,
  });

describe("Products page", () => {
  it("renders the hero heading", () => {
    renderProducts();
    expect(
      screen.getByRole("heading", { level: 1, name: /Nuestros productos/i }),
    ).toBeInTheDocument();
  });

  it("renders 2 category tabs", () => {
    renderProducts();
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(2);
  });

  it("renders the first category name in a FaqBubble question by default", () => {
    renderProducts();
    expect(
      screen.getByRole("heading", { level: 2, name: /Broches/i }),
    ).toBeInTheDocument();
  });

  it("renders the first category description in a FaqBubble answer by default", () => {
    renderProducts();
    expect(
      screen.getByText(/Broches de presión profesionales/i),
    ).toBeInTheDocument();
  });

  it("renders an image for the active category", () => {
    renderProducts();
    const images = screen.getAllByRole("img");
    // At least one image should be present (FaqBubble ImgCard)
    expect(images.length).toBeGreaterThan(0);
  });

  it("switching tab updates title, description, and carousel", async () => {
    const user = userEvent.setup();
    renderProducts();

    // Default: Broches
    expect(
      screen.getByRole("heading", { level: 2, name: /Broches/i }),
    ).toBeInTheDocument();

    // Click Caballetes tab
    await user.click(screen.getByRole("tab", { name: /Caballetes/i }));

    // Title switches
    expect(
      screen.getByRole("heading", { level: 2, name: /Caballetes/i }),
    ).toBeInTheDocument();
    // Description switches
    expect(
      screen.getByText(/Caballetes de acero inoxidable/i),
    ).toBeInTheDocument();
  });

  it("renders 1 carousel section (tabpanel) for the active category", () => {
    renderProducts();
    const panels = screen.getAllByRole("tabpanel");
    expect(panels).toHaveLength(1);
  });

  it("Presupuestar button is disabled when no products are selected", () => {
    renderProducts();
    const button = within(getActionBar()).getByRole("button", {
      name: /presupuestar/i,
    });
    expect(button).toBeDisabled();
  });

  it("selecting a product enables Presupuestar and shows counter", async () => {
    const user = userEvent.setup();
    renderProducts();

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]);

    const desktopGroup = getActionBar();
    const button = within(desktopGroup).getByRole("button", {
      name: /presupuestar/i,
    });
    expect(button).not.toBeDisabled();
    expect(within(desktopGroup).getByText("1")).toBeInTheDocument();
  });

  it("opening modal lists selected product names", async () => {
    const user = userEvent.setup();
    renderProducts();

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]);
    await user.click(
      within(getActionBar()).getByRole("button", {
        name: /presupuestar/i,
      }),
    );

    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("Broche Casco Bacan")).toBeInTheDocument();
  });

  it("× removes a product from the modal and updates selection", async () => {
    const user = userEvent.setup();
    renderProducts();

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]);
    await user.click(checkboxes[1]);
    await user.click(
      within(getActionBar()).getByRole("button", {
        name: /presupuestar/i,
      }),
    );

    const dialog = screen.getByRole("dialog");
    // Modal should list both
    expect(within(dialog).getByText("Broche Casco Bacan")).toBeInTheDocument();
    expect(within(dialog).getByText("Broche Casco Bacab")).toBeInTheDocument();

    // Remove first product
    const removeButtons = within(dialog).getAllByLabelText(/Quitar/);
    await user.click(removeButtons[0]);

    // First product should be gone from the modal
    expect(
      within(dialog).queryByText("Broche Casco Bacan"),
    ).not.toBeInTheDocument();
    // Counter should show 1
    expect(within(getActionBar()).getByText("1")).toBeInTheDocument();
  });

  it("Vaciar clears all selection and closes modal", async () => {
    const user = userEvent.setup();
    renderProducts();

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]);
    await user.click(
      within(getActionBar()).getByRole("button", {
        name: /presupuestar/i,
      }),
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    const dialog = screen.getByRole("dialog");
    await user.click(within(dialog).getByRole("button", { name: /vaciar/i }));

    // Modal auto-closes because selection is now empty
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    // Presupuestar is disabled again (count = 0)
    expect(
      within(getActionBar()).getByRole("button", {
        name: /presupuestar/i,
      }),
    ).toBeDisabled();
  });

  it("WhatsApp URL contains selected products", async () => {
    const user = userEvent.setup();
    renderProducts();

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]);
    await user.click(
      within(getActionBar()).getByRole("button", {
        name: /presupuestar/i,
      }),
    );

    const whatsappLink = screen.getByText("Consultar por WhatsApp");
    expect(whatsappLink.closest("a")).toHaveAttribute(
      "href",
      expect.stringContaining("Broche%20Casco%20Bacan"),
    );
  });

  it("Escape closes the modal", async () => {
    const user = userEvent.setup();
    renderProducts();

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]);
    await user.click(
      within(getActionBar()).getByRole("button", {
        name: /presupuestar/i,
      }),
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders the 'Borrar lista' button (red, disabled when no selection)", () => {
    renderProducts();
    const clearButton = within(getActionBar()).getByRole("button", {
      name: /borrar lista/i,
    });
    expect(clearButton).toBeInTheDocument();
    expect(clearButton.className).toContain("bg-red-500");
    expect(clearButton).toBeDisabled();
  });

  it("'Borrar lista' opens a confirmation modal without clearing the selection", async () => {
    const user = userEvent.setup();
    renderProducts();

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]);
    await user.click(checkboxes[1]);
    expect(within(getActionBar()).getByText("2")).toBeInTheDocument();

    await user.click(
      within(getActionBar()).getByRole("button", {
        name: /borrar lista/i,
      }),
    );

    // Confirmation modal opens
    const dialogs = screen.getAllByRole("dialog");
    expect(dialogs.length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getByText(/¿Estás seguro que querés borrar toda la lista/i),
    ).toBeInTheDocument();

    // Selection is still intact (counter still shows 2)
    expect(within(getActionBar()).getByText("2")).toBeInTheDocument();
  });

  it("Cancelar in confirmation modal closes it without clearing selection", async () => {
    const user = userEvent.setup();
    renderProducts();

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]);
    await user.click(
      within(getActionBar()).getByRole("button", {
        name: /borrar lista/i,
      }),
    );

    // Scope to the confirmation dialog
    const dialog = screen.getByRole("dialog", { name: /borrar lista/i });
    const cancelButton = within(dialog).getByRole("button", {
      name: /^cancelar$/i,
    });
    await user.click(cancelButton);

    // Modal closed, selection intact
    expect(
      screen.queryByText(/¿Estás seguro que querés borrar toda la lista/i),
    ).not.toBeInTheDocument();
    expect(within(getActionBar()).getByText("1")).toBeInTheDocument();
  });

  it("Borrar in confirmation modal clears all selections", async () => {
    const user = userEvent.setup();
    renderProducts();

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]);
    await user.click(checkboxes[1]);
    expect(within(getActionBar()).getByText("2")).toBeInTheDocument();

    await user.click(
      within(getActionBar()).getByRole("button", {
        name: /borrar lista/i,
      }),
    );

    // Scope to the confirmation dialog (the action bar Borrar lista button is outside)
    const dialog = screen.getByRole("dialog", { name: /borrar lista/i });
    const confirmButton = within(dialog).getByRole("button", {
      name: /borrar lista/i,
    });
    await user.click(confirmButton);

    // Selection cleared: counter badge is gone (hidden at 0), Presupuestar and Borrar lista are disabled
    expect(
      within(getActionBar()).queryByText("2"),
    ).not.toBeInTheDocument();
    expect(
      within(getActionBar()).getByRole("button", {
        name: /presupuestar/i,
      }),
    ).toBeDisabled();
    expect(
      within(getActionBar()).getByRole("button", {
        name: /borrar lista/i,
      }),
    ).toBeDisabled();
  });
});
