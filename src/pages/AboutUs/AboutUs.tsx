import { SectionWrapper, AboutSection } from "../../components/ui";
import { data } from "../../mocks/data";

/**
 * AboutUs page — page-level SectionWrapper (h1) wraps an AboutSection that
 * holds the gallery, content paragraphs, highlights, and CTA. The wrapper
 * provides the page header; AboutSection renders the body.
 */
export function AboutUs() {
  const about = data.home.aboutUsSection;

  return (
    <SectionWrapper
      eyebrow="Sobre Nosotros"
      title={about.title}
      theme="light"
      titlesAlign="start"
      headingLevel="h1"
    >
      <AboutSection
        content={about.content}
        imageAlt={about.imageAlt}
        highlights={about.highlights}
        cta={about.cta}
        images={[]}
      />
    </SectionWrapper>
  );
}
