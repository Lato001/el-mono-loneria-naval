import * as Dialog from "@radix-ui/react-dialog";
import { IconX } from "@tabler/icons-react";
import { data } from "../../../mocks/data";
import type { ModalProps } from "./Modal.types";

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  variant = "sheet",
  size = "md",
  children,
  className,
}: ModalProps) {
  const sizeClasses: Record<string, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
    full: "max-w-none w-auto",
  };

  const positionClasses =
    variant === "sheet"
      ? `inset-x-0 bottom-0 max-h-[85vh] rounded-t-2xl data-[state=open]:animate-modalSheetIn md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl md-data-state-open:animate-fadeIn ${size === "full" ? "md:max-w-none" : sizeClasses[size]}`
      : `left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl data-[state=open]:animate-fadeIn ${sizeClasses[size]}`;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-fadeIn" />
        <Dialog.Content
          className={`fixed z-50 w-full bg-sc-chalk p-4 focus:outline-none flex flex-col ${positionClasses} ${className ?? ""}`}
        >
          {title && (
            <Dialog.Title className="font-poppins mb-2 text-xl font-bold text-sc-ocean-blue">
              {title}
            </Dialog.Title>
          )}
          {description && (
            <Dialog.Description className="font-poppins mb-4 text-sm text-sc-ocean-blue/70">
              {description}
            </Dialog.Description>
          )}

          {children}

          <Dialog.Close asChild>
            <button
              type="button"
              aria-label={data.ui.closeLabel}
              className="absolute right-4 top-4 rounded-full p-1 bg-sc-ocean-blue text-sc-chalk transition-colors cursor-pointer hover:text-pr-aquamarine/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pr-aquamarine"
            >
              <IconX className="h-5 w-5" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
