import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ContactGrid } from "./ContactGrid";

function renderContactGrid() {
  return render(
    <MemoryRouter>
      <ContactGrid />
    </MemoryRouter>,
  );
}

describe("ContactGrid", () => {
  it("renders the contact section title", () => {
    renderContactGrid();
    expect(
      screen.getByRole("heading", { name: "Contacto" }),
    ).toBeInTheDocument();
  });

  it("renders the contact items with their hrefs", () => {
    renderContactGrid();
    expect(screen.getByText("Teléfono")).toBeInTheDocument();
    const phone = screen.getByText("+54 9 11 6990-6255");
    expect(phone.closest("a")).toHaveAttribute(
      "href",
      "tel:+54 9 11 6990-6255",
    );
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("renders the WhatsApp CTA link", () => {
    renderContactGrid();
    const cta = screen.getByRole("link", { name: "Hablá con Nosotros" });
    // VITE_WHATSAPP_URL comes from vite.config.ts test.env.
    expect(cta).toHaveAttribute(
      "href",
      expect.stringMatching(/^https:\/\/wa\.me\//),
    );
  });

  it("renders the WhatsApp column title", () => {
    renderContactGrid();
    expect(
      screen.getByRole("heading", { name: "¿Preferís WhatsApp?" }),
    ).toBeInTheDocument();
  });
});
