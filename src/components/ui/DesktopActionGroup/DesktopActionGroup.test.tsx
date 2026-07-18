import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DesktopActionGroup } from "./DesktopActionGroup";

const defaultProps = {
  selectedCount: 0,
  onPresupuestar: vi.fn(),
  presupuestarDisabled: true,
  onClear: vi.fn(),
};

describe("DesktopActionGroup", () => {
  it("renders with hidden md:flex class (desktop-only visibility)", () => {
    const { container } = render(<DesktopActionGroup {...defaultProps} />);
    const group = container.firstChild as HTMLElement;
    expect(group.className).toMatch(/\bhidden\b/);
    expect(group.className).toMatch(/\bmd:flex\b/);
  });

  it('has role="group" with aria-label from data.ui.desktopActionGroupLabel', () => {
    render(<DesktopActionGroup {...defaultProps} />);
    expect(
      screen.getByRole("group", { name: /Acciones del presupuesto/i }),
    ).toBeInTheDocument();
  });

  it("renders Presupuestar and Borrar lista buttons", () => {
    render(<DesktopActionGroup {...defaultProps} />);
    expect(
      screen.getByRole("button", { name: /presupuestar productos seleccionados/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /borrar lista de productos seleccionados/i }),
    ).toBeInTheDocument();
  });

  it('applies bg-red-500 to Borrar button (variant="danger")', () => {
    render(<DesktopActionGroup {...defaultProps} />);
    const borrar = screen.getByRole("button", {
      name: /borrar lista de productos seleccionados/i,
    });
    expect(borrar.className).toContain("bg-red-500");
  });

  it("renders selected-count badge on Presupuestar button when selectedCount > 0", () => {
    render(<DesktopActionGroup {...defaultProps} selectedCount={3} presupuestarDisabled={false} />);
    const presupuestar = screen.getByRole("button", {
      name: /presupuestar productos seleccionados/i,
    });
    expect(presupuestar).toHaveTextContent("3");
  });

  it("does not render the badge when selectedCount is 0", () => {
    render(<DesktopActionGroup {...defaultProps} selectedCount={0} />);
    const presupuestar = screen.getByRole("button", {
      name: /presupuestar productos seleccionados/i,
    });
    // Badge text "0" should not be inside the button.
    expect(presupuestar.textContent).not.toMatch(/\b0\b/);
  });

  it("propagates disabled and calls handlers on click", async () => {
    const user = userEvent.setup();
    const onPresupuestar = vi.fn();
    const onClear = vi.fn();
    render(
      <DesktopActionGroup
        selectedCount={2}
        onPresupuestar={onPresupuestar}
        presupuestarDisabled={false}
        onClear={onClear}
      />,
    );

    const presupuestar = screen.getByRole("button", {
      name: /presupuestar productos seleccionados/i,
    });
    const borrar = screen.getByRole("button", {
      name: /borrar lista de productos seleccionados/i,
    });

    expect(presupuestar).not.toBeDisabled();
    expect(borrar).not.toBeDisabled();

    await user.click(presupuestar);
    expect(onPresupuestar).toHaveBeenCalled();

    await user.click(borrar);
    expect(onClear).toHaveBeenCalled();
  });
});
