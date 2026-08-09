import { IconBrandWhatsapp } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import googleLogo from "../../../assets/logos/icons/google/google-icon.svg";
import "./WhatsappButton.css";
interface LinkButtonProps {
  className?: string;
  size?: "sm" | "md";
  text: string;
  type?: "Contact" | "Redirect" | "Google";
  path?: string;
  url?: string;
  theme?: string;
}

export function LinkButton({
  className,
  size = "md",
  text,
  type = "Contact",
  path = import.meta.env.VITE_WHATSAPP_URL,
  theme,
  url,
}: LinkButtonProps) {
  const isSmall = size === "sm";

  return (
    <>
      {type === "Contact" && (
        <Link
          to={path}
          className={`inline-flex items-center gap-3 whitespace-nowrap font-poppins font-semibold text-sc-ocean-blue shadow-lg transition-all duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300 cursor-pointer animate-pulse-glow bg-sc-chalk ${
            isSmall
              ? "rounded-full px-3 py-1.5 text-sm"
              : "rounded-full px-4 py-2.5"
          } ${className}`}
        >
          <IconBrandWhatsapp
            className="text-green-600"
            size={isSmall ? 20 : 28}
            aria-hidden="true"
          />
          {text}
        </Link>
      )}
      {type === "Redirect" && (
        <Link
          to={path}
          className={`inline-flex items-center gap-3 rounded-lg px-4 py-2.5 font-poppins font-semibold shadow-lg transition-all duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pr-aquamarine cursor-pointer ${
            theme === "light"
              ? "bg-sc-chalk text-sc-ocean-blue "
              : "bg-sc-ocean-blue text-sc-chalk hover:bg-sc-ocean-blue/80"
          } ${className}`}
        >
          {text}
        </Link>
      )}
      {type === "Google" && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={` group inline-flex items-center gap-4 rounded-full border border-zinc-100 bg-green py-2 pl-2 pr-8 shadow-[0_10px_30px_rgba(15,23,42,.08)] transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-200 
            hover:shadow-[0_16px_40px_rgba(15,23,42,.12)] active:scale-[0.98] ${className} ${theme === "light" ? "bg-white border-white" : "bg-sc-ocean-blue border-sc-ocean-blue"}`}
        >
          <div
            className={`bg-white flex h-10 w-10 items-center justify-center rounded-full border shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:bg-white group-hover:shadow-md ${className}`}
          >
            <img
              src={googleLogo}
              alt="Google"
              className={`h-6 w-6 object-contain transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110 `}
            />
          </div>
          <span className={`ml-2 font-poppins text-lg font-semibold tracking-tight ${theme === "light" ? "text-black/75 " : "text-white"}`}>
            {text}
          </span>
        </a>
      )}
    </>
  );
}
