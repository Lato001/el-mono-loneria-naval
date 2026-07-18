import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ActionBar } from "./ActionBar";

const defaultProps = {
  selectedCount: 0,
  onPresupuestar: vi.fn(),
  presupuestarDisabled: true,
  onClear: vi.fn(),
};

describe("ActionBar", () => {
  it("renders with md:hidden class (mobile-only visibility)", () => {
    const { container } = render(<ActionBar {...defaultProps} />);
    const bar = container.firstChild as HTMLElement;
    expect(bar.className).toMatch(/\bmd:hidden\b/);
  });

  it('has role="region" with aria-label from data.ui.actionBarLabel', () => {
    render(<ActionBar {...defaultProps} />);
    expect(
      screen.getByRole("region", { name: /Acciones del presupuesto/i }),
    ).toBeInTheDocument();
  });

  it("renders Presupuestar and Borrar lista buttons", () => {
    render(<ActionBar {...defaultProps} />);
    expect(
      screen.getByRole("button", { name: /presupuestar productos seleccionados/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /borrar lista de productos seleccionados/i }),
    ).toBeInTheDocument();
  });

  it("applies min-h-11 to both action buttons (44px touch target)", () => {
    render(<ActionBar {...defaultProps} />);
    const presupuestar = screen.getByRole("button", {
      name: /presupuestar productos seleccionados/i,
    });
    const borrar = screen.getByRole("button", {
      name: /borrar lista de productos seleccionados/i,
    });
    expect(presupuestar.className).toMatch(/\bmin-h-11\b/);
    expect(borrar.className).toMatch(/\bmin-h-11\b/);
  });

  it("includes env(safe-area-inset-bottom) for iOS home indicator padding", () => {
    const { container } = render(<ActionBar {...defaultProps} />);
    const bar = container.firstChild as HTMLElement;
    expect(bar.className).toContain("env(safe-area-inset-bottom)");
  });

  it("propagates disabled to both buttons and calls handlers on click", async () => {
    const user = userEvent.setup();
    const onPresupuestar = vi.fn();
    const onClear = vi.fn();
    render(
      <ActionBar
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
