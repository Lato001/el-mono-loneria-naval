import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Hero } from "./Hero";

// The ui barrel (imported by Hero) pulls in MediaPlayer → react-player, which
// throws unhandled rejections in jsdom.
vi.mock("react-player", () => ({
  default: () => <div data-testid="mock-player" />,
}));

const baseProps = {
  primaryCta: "Ver productos",
  secondaryCta: "Ver trabajos",
};

function renderHero(
  props: Partial<Parameters<typeof Hero>[0]> = {},
) {
  return render(
    <MemoryRouter>
      <Hero {...baseProps} {...props} />
    </MemoryRouter>,
  );
}

describe("Hero", () => {
  it("renders the eyebrow", () => {
    renderHero({ eyebrow: "Lonería naval" });
    expect(screen.getByText("Lonería naval")).toBeInTheDocument();
  });

  it("renders the title combining prefix and highlight", () => {
    renderHero({ titlePrefix: "Lonas ", titleHighlight: "a medida" });
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Lonas a medida");
  });

  it("renders the description", () => {
    renderHero({ description: "Protección náutica a tu medida" });
    expect(
      screen.getByText("Protección náutica a tu medida"),
    ).toBeInTheDocument();
  });

  it("renders the primary and secondary CTAs as routed links", () => {
    renderHero();
    expect(
      screen.getByRole("link", { name: "Ver productos" }),
    ).toHaveAttribute("href", "/productos");
    expect(
      screen.getByRole("link", { name: "Ver trabajos" }),
    ).toHaveAttribute("href", "/trabajos");
  });

  it("omits the video carousel when no videos are provided", () => {
    renderHero();
    expect(screen.queryByTestId("mock-player")).not.toBeInTheDocument();
  });
});
