import type { ReactNode } from "react";

export type ModalVariant = "sheet" | "centered";

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  variant?: ModalVariant;
  children: ReactNode;
  className?: string;
}
