import { IconBrandWhatsapp } from "@tabler/icons-react";
import { data } from "../../../mocks/data";
import "./WhatsappButton.css";

export function WhatsappButton() {
  return (
    <a
      href={import.meta.env.VITE_WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={data.ui.contactWhatsAppLabel}
      className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-green-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-300 animate-pulse-glow cursor-pointer"
    >
      <IconBrandWhatsapp size={28} aria-hidden="true" />
    </a>
  );
}
