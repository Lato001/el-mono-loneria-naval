import { render, screen } from "@testing-library/react";
import { WhatsappButton } from "./WhatsappButton";

// Read the env value the component will see at render time (Vite bakes
// import.meta.env at module-load, so we can't override it in beforeAll).
const WHATSAPP_URL = import.meta.env.VITE_WHATSAPP_URL;

describe("WhatsappButton", () => {
  it("renders as an external link with the WhatsApp URL, target=_blank, and rel=noopener noreferrer", () => {
    render(<WhatsappButton />);
    const link = screen.getByRole("link", { name: /whatsapp/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", WHATSAPP_URL);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link.getAttribute("href")).toMatch(/^https:\/\/wa\.me\//);
  });

  it("is positioned fixed at bottom-right with a high z-index", () => {
    render(<WhatsappButton />);
    const link = screen.getByRole("link", { name: /whatsapp/i });
    expect(link.className).toContain("fixed");
    expect(link.className).toContain("bottom-8");
    expect(link.className).toContain("right-8");
    expect(link.className).toContain("z-50");
  });

  it("has chalk background, rounded-full shape, and green icon color", () => {
    render(<WhatsappButton />);
    const link = screen.getByRole("link", { name: /whatsapp/i });
    expect(link.className).toContain("bg-sc-chalk");
    expect(link.className).toContain("rounded-full");
    expect(link.className).toContain("text-green-600");
  });

  it("has hover and focus interaction styles", () => {
    render(<WhatsappButton />);
    const link = screen.getByRole("link", { name: /whatsapp/i });
    expect(link.className).toContain("hover:scale-105");
    expect(link.className).toContain("hover:bg-green-600");
    expect(link.className).toContain("focus-visible:ring-2");
  });

  it("renders the IconBrandWhatsapp icon as decorative (aria-hidden)", () => {
    const { container } = render(<WhatsappButton />);
    const icon = container.querySelector(".tabler-icon-brand-whatsapp");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("aria-hidden", "true");
  });
});
