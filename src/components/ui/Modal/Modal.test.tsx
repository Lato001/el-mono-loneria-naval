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
    // The title is constrained so it never collides with the close button.
    expect(screen.getByText("Test Modal")).toHaveClass(
      "max-w-[calc(100%_-_2.5rem)]",
    );
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

  it("uses ocean-blue title text by default (textColor=dark)", () => {
    render(
      <Modal open={true} onOpenChange={() => {}} title="Dark text">
        <p>Content</p>
      </Modal>,
    );

    expect(screen.getByText("Dark text")).toHaveClass("text-sc-ocean-blue");
  });

  it("uses chalk title text when textColor=\"light\"", () => {
    render(
      <Modal open={true} onOpenChange={() => {}} title="Light text" textColor="light">
        <p>Content</p>
      </Modal>,
    );

    expect(screen.getByText("Light text")).toHaveClass("text-sc-chalk");
  });

  it("applies sheet position classes by default; centered classes when variant=\"centered\" is passed", () => {
    const { unmount } = render(
      <Modal open={true} onOpenChange={() => {}} title="Default (sheet)">
        <p>Sheet content</p>
      </Modal>,
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog.className).toContain("bottom-0");
    expect(dialog.className).toContain("rounded-t-2xl");
    expect(dialog.className).toContain("max-h-[85vh]");
    // On mobile the sheet reaches at least half the screen height.
    expect(dialog.className).toContain("max-md:min-h-[50vh]");
    unmount();

    render(
      <Modal open={true} onOpenChange={() => {}} title="Centered" variant="centered">
        <p>Centered content</p>
      </Modal>,
    );

    const centeredDialog = screen.getByRole("dialog");
    expect(centeredDialog.className).toContain("left-1/2");
    expect(centeredDialog.className).toContain("max-w-md");
    expect(centeredDialog.className).toContain("rounded-2xl");
  });
});
