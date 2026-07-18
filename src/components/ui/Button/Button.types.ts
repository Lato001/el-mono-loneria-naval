import type { ReactNode } from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "hero"
  | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  ariaLabel?: string;
  /**
   * Optional badge content rendered in the upper-right corner of the button
   * (e.g. a selected-item count). Pass `undefined` to hide. The button gets
   * `position: relative` automatically when a badge is present.
   */
  badge?: ReactNode;
}
