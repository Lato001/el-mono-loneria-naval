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
  it("hides the WhatsApp button on the products page", () => {
    renderApp("/productos");
    expect(
      screen.queryByRole("link", { name: /whatsapp/i }),
    ).not.toBeInTheDocument();
  });
});
