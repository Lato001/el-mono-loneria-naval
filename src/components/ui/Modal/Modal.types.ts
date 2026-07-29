import type { ReactNode } from "react";

export type ModalVariant = "sheet" | "centered";

export type ModalSize = "sm" | "md" | "lg" | "full";

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  variant?: ModalVariant;
  size?: ModalSize;
  children: ReactNode;
  className?: string;
}
