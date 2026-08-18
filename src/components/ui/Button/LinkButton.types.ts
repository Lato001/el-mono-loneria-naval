export interface LinkButtonProps {
  className?: string;
  size?: "sm" | "md";
  text: string;
  type?: "Contact" | "Redirect" | "Google";
  path?: string;
  url?: string;
  theme?: string;
}
