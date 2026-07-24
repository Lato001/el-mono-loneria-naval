import { LinkButton } from "..";
import {
  IconMail,
  IconMapPin,
  IconPhone,
  type Icon,
} from "@tabler/icons-react";
import { data } from "../../../mocks/data";
import type { ContactIconKey } from "../../../mocks/types";

export function ContactGrid() {
  const contactIconMap: Record<ContactIconKey, Icon> = {
    phone: IconPhone,
    mail: IconMail,
    mapPin: IconMapPin,
  };

  const contactItems = data.nav.footer.contact;
  return (
    <>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Left column: Contact info card */}
        <div className="rounded-lg bg-sc-chalk p-8 shadow-lg">
          <h2 className="font-poppins mb-6 text-xl font-bold text-sc-ocean-blue">
            {data.ui.contactSectionTitle}
          </h2>
          <ul className="flex flex-col gap-4">
            {contactItems.map((item) => {
              const Icon = contactIconMap[item.iconKey];
              return (
                <li key={item.label} className="flex items-start gap-3">
                  <Icon
                    size={20}
                    className="mt-0.5 shrink-0 text-pr-hero-blue"
                    aria-hidden="true"
                  />
                  <div className="flex flex-col">
                    <span className="font-poppins text-sm font-semibold text-sc-ocean-blue">
                      {item.label}
                    </span>
                    <a
                      href={item.href}
                      className="font-poppins text-sm text-sc-ocean-blue/70 transition-colors hover:text-pr-hero-blue hover:underline"
                    >
                      {item.value}
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right column: WhatsApp CTA */}
        <div className="flex flex-col items-center justify-center rounded-lg bg-sc-chalk p-8 shadow-lg">
          <h2 className="font-poppins mb-4 text-xl font-bold text-sc-ocean-blue">
            ¿Preferís WhatsApp?
          </h2>
          <p className="font-poppins mb-6 text-center text-sm text-sc-ocean-blue/70">
            Escribinos directamente y te respondemos a la brevedad.
          </p>
          <LinkButton type="Contact" text="Hablá con Nosotros"></LinkButton>
        </div>
      </div>
    </>
  );
}
