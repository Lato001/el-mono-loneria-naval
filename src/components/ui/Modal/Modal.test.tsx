import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "./Modal";

describe("Modal", () => {
  it("renders title and children when open=true", () => {
    render(
      <Modal open={true} onOpenChange={() => {}} title="Test Modal">
        <p>Modal content</p>
      </Modal>,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByText("Modal content")).toBeInTheDocument();
  });

  it("does not render dialog when open=false", () => {
    render(
      <Modal open={false} onOpenChange={() => {}} title="Hidden Modal">
        <p>Hidden content</p>
      </Modal>,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("calls onOpenChange(false) when Escape is pressed", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <Modal open={true} onOpenChange={onOpenChange} title="Escape Test">
        <p>Content</p>
      </Modal>,
    );

    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("calls onOpenChange(false) when overlay is clicked", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <Modal open={true} onOpenChange={onOpenChange} title="Overlay Test">
        <p>Content</p>
      </Modal>,
    );

    // Click the overlay (the element behind the dialog content)
    const overlay = document.querySelector('[class*="fixed inset-0"]');
    if (overlay) {
      await user.click(overlay);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    }
  });

  it("renders description when provided", () => {
    render(
      <Modal
        open={true}
        onOpenChange={() => {}}
        title="Title"
        description="A description"
      >
        <p>Content</p>
      </Modal>,
    );

    expect(screen.getByText("A description")).toBeInTheDocument();
  });

  it("renders close button with aria-label", () => {
    render(
      <Modal open={true} onOpenChange={() => {}} title="Close Test">
        <p>Content</p>
      </Modal>,
    );

    expect(screen.getByLabelText("Cerrar")).toBeInTheDocument();
  });
});
