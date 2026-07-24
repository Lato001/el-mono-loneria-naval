import {
  IconBrandWhatsapp,
  IconMail,
  IconMapPin,
  IconPhone,
  type Icon,
} from "@tabler/icons-react";
import { MapSection, SectionWrapper } from "../../components/ui";
import { data } from "../../mocks/data";
import type { ContactIconKey } from "../../mocks/types";

const contactIconMap: Record<ContactIconKey, Icon> = {
  phone: IconPhone,
  mail: IconMail,
  mapPin: IconMapPin,
};

const PAGE_DESCRIPTION =
  "Estamos disponibles para responder tus consultas y presupuestar tu trabajo a medida.";

/**
 * Contact page — page-level SectionWrapper (h1) with the page description and
 * a 2-column grid: contact info card (phone, email, address) and WhatsApp CTA.
 */
export function Contact() {
  const contactItems = data.nav.footer.contact;
  const whatsappUrl = import.meta.env.VITE_WHATSAPP_URL;

  return (
    <SectionWrapper
      eyebrow="Contacto"
      title="Hablemos de tu proyecto"
      theme="light"
      titlesAlign="start"
      headingLevel="h1"
    >
      <p className="mb-8 max-w-2xl font-poppins text-base leading-relaxed text-sc-ocean-blue/70">
        {PAGE_DESCRIPTION}
      </p>

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
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contactar por WhatsApp"
            className="inline-flex items-center gap-2 rounded-md bg-green-500 px-6 py-3 font-poppins font-medium text-white transition-colors hover:bg-green-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300"
          >
            <IconBrandWhatsapp size={20} aria-hidden="true" />
            Contactar por WhatsApp
          </a>
        </div>
      </div>

      <SectionWrapper title="Nuestro Taller" eyebrow="Ubicacion" theme="light">
        <MapSection
          latitude={-34.4351676}
          longitude={-58.5956366}
          zoom={15}
          markerLabel="El Mono Lonería Naval"
        />
      </SectionWrapper>
    </SectionWrapper>
  );
}
