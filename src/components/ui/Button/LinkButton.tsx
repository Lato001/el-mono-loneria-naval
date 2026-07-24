import { IconBrandWhatsapp } from "@tabler/icons-react";
import { Link } from "react-router-dom";

interface LinkButtonProps {
  className?: string;
  text: string;
  type?: "Contact" | "Redirect";
  path?: string;
}

export function LinkButton({
  className,
  text,
  type = "Contact",
  path = import.meta.env.VITE_WHATSAPP_URL,
}: LinkButtonProps) {
  return (
    <>
      {type == "Contact" && (
        <Link
          to={path}
          className={`flex  gap-3 items-center shrink-0 rounded-lg bg-green-600 text-sc-chalk px-4 py-2.5 font-poppins font-semibold  transition-color shadow-lg transition-all duration-300 hover:scale-105 hover:bg-green-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-300 animate-pulse-glow cursor-pointer ${className}`}
        >
          <IconBrandWhatsapp size={28} aria-hidden="true" />
          {text}
        </Link>
      )}
      {type == "Redirect" && (
        <Link
          to={path}
          className={`flex  gap-3 items-center shrink-0 rounded-lg bg-pr-hero-blue text-sc-chalk px-4 py-2.5 font-poppins font-semibold  transition-color shadow-lg transition-all duration-300 hover:scale-105 hover:bg-pr-aquamarine focus:outline-none focus-visible:ring-2 focus-visible:ring-pr-aquamarine animate-pulse-glow cursor-pointer ${className}`}
        >
          {text}
        </Link>
      )}
    </>
  );
}
