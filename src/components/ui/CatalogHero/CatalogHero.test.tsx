import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CatalogHero } from "./CatalogHero";

describe("CatalogHero", () => {
  it("renders title", () => {
    render(
      <CatalogHero title="Nuestros productos" ctaLabel="Ver catálogo" ctaTargetId="tabs" />,
    );
    expect(screen.getByRole("heading")).toHaveTextContent("Nuestros productos");
  });

  it("renders description when provided", () => {
    render(
      <CatalogHero
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
      <CatalogHero title="Productos" ctaLabel="Ver catálogo" ctaTargetId="tabs" />,
    );
    expect(screen.getByText("Ver catálogo")).toBeInTheDocument();
  });

  it("calls scrollIntoView on CTA click", async () => {
    const user = userEvent.setup();

    // Create a target element
    const target = document.createElement("div");
    target.id = "tabs";
    target.scrollIntoView = vi.fn();
    document.body.appendChild(target);

    render(
      <CatalogHero title="Productos" ctaLabel="Ver catálogo" ctaTargetId="tabs" />,
    );

    await user.click(screen.getByText("Ver catálogo"));
    expect(target.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });

    document.body.removeChild(target);
  });
});
