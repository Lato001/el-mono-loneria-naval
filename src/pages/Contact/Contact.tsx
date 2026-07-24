import { LinkButton, MapSection, SectionWrapper } from "../../components/ui";
import { ContactGrid } from "../../components/ui/ContactGrid/ContactGrid";

/**
 * Contact page — page-level SectionWrapper (h1) with the page description and
 * a 2-column grid: contact info card (phone, email, address) and WhatsApp CTA.
 */
export function Contact() {
  return (
    <>
      <SectionWrapper
        eyebrow="Contacto"
        title="Hablemos de tu proyecto"
        titlesAlign="start"
        headingLevel="h1"
      >
        <ContactGrid></ContactGrid>
      </SectionWrapper>

      <SectionWrapper
        eyebrow="Ubicacion"
        title="Donde encontrarnos"
        titlesAlign="center"
        theme="light"
        className="w-full p-10 "
      >
        <MapSection
          latitude={-34.4351676}
          longitude={-58.5956366}
          zoom={15}
          markerLabel="El Mono Lonería Naval"
        />
        <div className="mt-10 flex justify-center">
          <LinkButton
            type="Google"
            text="Abrir en Google Maps"
            className="bg-sc-ocean-blue"
            url="https://maps.app.goo.gl/5yJprtv3uSdtv13M7"
          />
        </div>
      </SectionWrapper>
    </>
  );
}
