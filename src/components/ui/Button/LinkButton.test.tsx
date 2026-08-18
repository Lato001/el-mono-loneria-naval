import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { LinkButtonProps } from "./LinkButton.types";
import { LinkButton } from "./LinkButton";

function renderLinkButton(props: LinkButtonProps = { text: "Botón" }) {
  return render(
    <MemoryRouter>
      <LinkButton {...props} />
    </MemoryRouter>,
  );
}

describe("LinkButton", () => {
  it("renders a Contact link to the WhatsApp deep link", () => {
    renderLinkButton({ type: "Contact", text: "Consultar por WhatsApp" });
    const link = screen.getByRole("link", {
      name: "Consultar por WhatsApp",
    });
    // VITE_WHATSAPP_URL comes from vite.config.ts test.env.
    expect(link).toHaveAttribute(
      "href",
      expect.stringMatching(/^https:\/\/wa\.me\//),
    );
  });

  it("renders a Redirect link to the provided path", () => {
    renderLinkButton({
      type: "Redirect",
      text: "Ver catálogo",
      path: "/productos",
    });
    const link = screen.getByRole("link", { name: "Ver catálogo" });
    expect(link).toHaveAttribute("href", "/productos");
  });

  it("renders a Google link that opens in a new tab", () => {
    renderLinkButton({
      type: "Google",
      text: "Entrar con Google",
      url: "https://accounts.google.com",
    });
    const link = screen.getByRole("link", { name: /Entrar con Google/ });
    expect(link).toHaveAttribute("href", "https://accounts.google.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("applies the small sizing classes when size is sm", () => {
    renderLinkButton({ type: "Redirect", text: "Chico", size: "sm" });
    expect(screen.getByRole("link", { name: "Chico" }).className).toContain(
      "rounded-full",
    );
  });

  it("renders nothing when the type matches no branch", () => {
    renderLinkButton({ type: "Bogus" as never, text: "Nada" });
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
