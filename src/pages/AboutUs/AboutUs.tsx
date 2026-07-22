import { SectionHero, AboutSection } from "../../components/ui";
import { data } from "../../mocks/data";

const PAGE_DESCRIPTION =
  "Conocé nuestra historia, nuestro taller y el equipo que hace posible cada trabajo a medida.";

/**
 * AboutUs page — SectionHero + AboutSection fed by data.home.aboutUsSection.
 */
export function AboutUs() {
  const about = data.home.aboutUsSection;

  return (
    <>
      <SectionHero
        title={about.title}
        description={PAGE_DESCRIPTION}
      />
      <AboutSection
        eyebrow={about.eyebrow}
        title={about.title}
        content={about.content}
        imageAlt={about.imageAlt}
        highlights={about.highlights}
        cta={about.cta}
        images={[]}
      />
    </>
  );
}
