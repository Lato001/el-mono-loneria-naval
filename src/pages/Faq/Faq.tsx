import { SectionWrapper } from "../../components/ui/SectionWrapper";
import { Accordion } from "../../components/ui/Accordion";
import { data } from "../../mocks/data";

export function Faq() {
  const faqSection = data.home.sections.faq;

  return (
    <SectionWrapper
      eyebrow={faqSection.eyebrow}
      title={faqSection.title}
      theme={faqSection.theme}
      titlesAlign={faqSection.titlesAlign}
      headingLevel="h1"
    >
      <Accordion items={data.home.faqs} />
    </SectionWrapper>
  );
}
