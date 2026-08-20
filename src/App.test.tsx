import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

// Mock react-player so MediaPlayer doesn't load youtube-video-element
// (which throws unhandled rejections in jsdom).
vi.mock("react-player", () => ({
  default: () => <div data-testid="mock-player" />,
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

function renderApp(initialPath: string) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <App />
    </MemoryRouter>,
  );
}

describe("App", () => {
  it("renders the DevBadge WhatsApp link as the only WhatsApp anchor on /productos", () => {
    renderApp("/productos");
    // The Footer's DevBadge carries a global WhatsApp signature link on every
    // route. With no products selected, the Products page itself does not
    // render its own WhatsApp CTA — so the only one expected is the DevBadge's.
    const whatsappLinks = screen.queryAllByRole("link", { name: /whatsapp/i });
    expect(whatsappLinks).toHaveLength(1);
    expect(whatsappLinks[0]).toHaveAttribute(
      "aria-label",
      "Escribir a Lautaro Camejo por WhatsApp",
    );
  });
});
