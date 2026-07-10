import { Link } from "react-router-dom";
import type { ButtonProps } from "./Button.types";

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-white text-sc-ocean-blue hover:bg-sc-chalk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pr-aquamarine",
  secondary:
    "bg-pr-aquamarine text-sc-ocean-blue hover:bg-pr-aquamarine/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sc-ocean-blue",
  outline:
    "border-2 border-white text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
  ghost:
    "text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-7 py-3.5 text-lg",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-md font-poppins font-medium transition-colors";

// Applied when disabled regardless of render mode (button, span, or Link).
// Note: <a>/<Link> elements do not support the `disabled` HTML attribute,
// so visual + aria disabling is handled manually for those branches.
const disabledClasses = "opacity-50 pointer-events-none cursor-not-allowed";

/**
 * Button component with three render modes:
 *
 * 1. `href` provided + `disabled` -> renders `<span>` with disabled visual styles.
 *    This avoids a broken Link that navigates despite being "disabled".
 * 2. `href` provided + not disabled -> renders `<Link>` (react-router-dom).
 *    The `<Link>` branch is only reached when `disabled` is falsy, so no
 *    `aria-disabled` or click-prevention is needed here.
 * 3. No `href` (or empty string -- treated as no-href) -> renders `<button>`.
 *
 * `disabled` is fully respected only in `<button>` mode (native attribute).
 * In `<span>` mode (href + disabled), both visual and `aria-disabled` are applied.
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  className,
  type = "button",
  disabled,
  ariaLabel,
}: ButtonProps) {
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}${className ? ` ${className}` : ""}${disabled ? ` ${disabledClasses}` : ""}`;

  // When href + disabled: render a non-navigable <span> to avoid broken Link.
  // Empty string href is treated as no-href (renders <button> below).
  if (href && disabled) {
    return (
      <span
        className={classes}
        aria-label={ariaLabel}
        aria-disabled="true"
        role="link"
      >
        {children}
      </span>
    );
  }

  if (href) {
    return (
      <Link
        to={href}
        className={classes}
        aria-label={ariaLabel}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
