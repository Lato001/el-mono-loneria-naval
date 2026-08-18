import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SectionHero } from "./SectionHero";

describe("SectionHero", () => {
  it("renders title", () => {
    render(
      <SectionHero title="Nuestros productos" ctaLabel="Ver catálogo" ctaTargetId="tabs" />,
    );
    expect(screen.getByRole("heading")).toHaveTextContent("Nuestros productos");
  });

  it("renders description when provided", () => {
    render(
      <SectionHero
        title="Productos"
        description="Explorá nuestro catálogo"
        ctaLabel="Ver"
        ctaTargetId="tabs"
      />,
    );
    expect(screen.getByText("Explorá nuestro catálogo")).toBeInTheDocument();
  });

  it("renders CTA button with correct label", () => {
    render(
      <SectionHero title="Productos" ctaLabel="Ver catálogo" ctaTargetId="tabs" />,
    );
    expect(screen.getByText("Ver catálogo")).toBeInTheDocument();
  });

  it("calls scrollIntoView on CTA click", async () => {
    const user = userEvent.setup();

    const target = document.createElement("div");
    target.id = "tabs";
    target.scrollIntoView = vi.fn();
    document.body.appendChild(target);

    render(
      <SectionHero title="Productos" ctaLabel="Ver catálogo" ctaTargetId="tabs" />,
    );

    await user.click(screen.getByText("Ver catálogo"));
    expect(target.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });

    document.body.removeChild(target);
  });

  it("does not render the CTA button when ctaLabel is omitted", () => {
    render(<SectionHero title="Nuestros productos" description="Sin CTA" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders background as a separate layer and content at full opacity", () => {
    const { container } = render(
      <SectionHero title="Catálogo" description="Texto completo" img="/test-bg.svg" />,
    );
    const section = container.querySelector("section")!;
    expect(section.style.opacity).toBe("");
    const bgLayer = section.querySelector<HTMLElement>("[data-testid='hero-bg']");
    expect(bgLayer).not.toBeNull();
    expect(bgLayer?.getAttribute("src")).toContain("/test-bg.svg");
    expect(bgLayer?.getAttribute("aria-hidden")).toBe("true");
    expect(bgLayer?.className).toContain("object-cover");
    const contentWrapper = section.querySelector<HTMLElement>("[data-testid='hero-content']");
    expect(contentWrapper).not.toBeNull();
    expect(screen.getByRole("heading")).toHaveTextContent("Catálogo");
    expect(screen.getByText("Texto completo")).toBeInTheDocument();
  });

  it("uses default fallback background when no img prop is given", () => {
    const { container } = render(<SectionHero title="Test" />);
    const bgLayer = container.querySelector<HTMLElement>("[data-testid='hero-bg']");
    expect(bgLayer).not.toBeNull();
    expect(bgLayer?.getAttribute("src")).toContain("formas-acuarela-01.webp");
    const contentWrapper = container.querySelector<HTMLElement>("[data-testid='hero-content']");
    expect(contentWrapper).not.toBeNull();
  });
});
