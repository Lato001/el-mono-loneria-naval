import * as Dialog from "@radix-ui/react-dialog";
import { IconX } from "@tabler/icons-react";
import type { ModalProps } from "./Modal.types";

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  variant = "centered",
  children,
  className,
}: ModalProps) {
  const positionClasses =
    variant === "sheet"
      ? "inset-x-0 bottom-0 max-h-[85vh] rounded-t-2xl data-[state=open]:animate-slideUp"
      : "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-md rounded-2xl data-[state=open]:animate-fadeIn";

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-fadeIn" />
        <Dialog.Content
          className={`fixed z-50 w-[calc(100%-2rem)] bg-white p-6 shadow-2xl focus:outline-none ${positionClasses} ${className ?? ""}`}
        >
          <Dialog.Title className="font-poppins mb-2 text-xl font-bold text-sc-ocean-blue">
            {title}
          </Dialog.Title>
          {description && (
            <Dialog.Description className="font-poppins mb-4 text-sm text-sc-ocean-blue/70">
              {description}
            </Dialog.Description>
          )}

          {children}

          <Dialog.Close asChild>
            <button
              type="button"
              aria-label="Cerrar"
              className="absolute right-4 top-4 rounded-full p-1 text-sc-ocean-blue/60 transition-colors hover:bg-sc-chalk hover:text-sc-ocean-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pr-aquamarine"
            >
              <IconX className="h-5 w-5" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
