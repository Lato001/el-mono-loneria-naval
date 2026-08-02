import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, it, expect } from "vitest";
import { Contact } from "./Contact";
import { data } from "../../mocks/data";

vi.mock("react-map-gl/maplibre", () => ({
  default: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="mock-map">{children}</div>
  ),
  Marker: ({ longitude, latitude }: { longitude: number; latitude: number }) => (
    <div data-testid="mock-marker" data-lng={longitude} data-lat={latitude} />
  ),
}));

const WHATSAPP_URL = "https://wa.me/123";

describe("Contact page", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  function renderContact() {
    return render(
      <MemoryRouter>
        <Contact />
      </MemoryRouter>,
    );
  }

  it("renders the page-level heading (h1) with the correct title", () => {
    vi.stubEnv("VITE_WHATSAPP_URL", WHATSAPP_URL);
    renderContact();

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /hablemos de tu proyecto/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders the WhatsApp CTA card copy", () => {
    vi.stubEnv("VITE_WHATSAPP_URL", WHATSAPP_URL);
    renderContact();

    expect(
      screen.getByText(
        /Escribinos directamente y te respondemos a la brevedad/i,
      ),
    ).toBeInTheDocument();
  });

  it("renders all 3 contact info items from data.nav.footer.contact", () => {
    vi.stubEnv("VITE_WHATSAPP_URL", WHATSAPP_URL);
    renderContact();

    const contactItems = data.nav.footer.contact;
    expect(contactItems).toHaveLength(3);

    for (const item of contactItems) {
      expect(screen.getByText(item.label)).toBeInTheDocument();
      expect(screen.getByText(item.value)).toBeInTheDocument();
    }
  });

  it("renders contact info items as clickable links with correct hrefs", () => {
    vi.stubEnv("VITE_WHATSAPP_URL", WHATSAPP_URL);
    renderContact();

    const contactItems = data.nav.footer.contact;
    for (const item of contactItems) {
      const link = screen.getByText(item.value).closest("a");
      expect(link).toHaveAttribute("href", item.href);
    }
  });

  it("renders the WhatsApp CTA with the correct href from env", () => {
    vi.stubEnv("VITE_WHATSAPP_URL", WHATSAPP_URL);
    renderContact();

    const whatsappLink = screen.getByRole("link", {
      name: /habl[aá] con nosotros/i,
    });
    expect(whatsappLink).toHaveAttribute("href", WHATSAPP_URL);
  });

  it("renders the WhatsApp icon inside the CTA", () => {
    vi.stubEnv("VITE_WHATSAPP_URL", WHATSAPP_URL);
    renderContact();

    const whatsappLink = screen.getByRole("link", {
      name: /habl[aá] con nosotros/i,
    });
    expect(
      whatsappLink.querySelector(".tabler-icon-brand-whatsapp"),
    ).toBeInTheDocument();
  });

  it("renders the map section with heading", () => {
    vi.stubEnv("VITE_WHATSAPP_URL", WHATSAPP_URL);
    renderContact();

    const headings = screen.getAllByRole("heading", { level: 2 });
    expect(headings.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText(/ubicacion/i)).toBeInTheDocument();
  });

  it("renders the map with a marker at Tigre coordinates", () => {
    vi.stubEnv("VITE_WHATSAPP_URL", WHATSAPP_URL);
    renderContact();

    const marker = screen.getByTestId("mock-marker");
    expect(marker).toHaveAttribute("data-lat", "-34.4351676");
    expect(marker).toHaveAttribute("data-lng", "-58.5956366");
  });

  it("renders the map container", () => {
    vi.stubEnv("VITE_WHATSAPP_URL", WHATSAPP_URL);
    renderContact();

    expect(screen.getByTestId("mock-map")).toBeInTheDocument();
  });
});
