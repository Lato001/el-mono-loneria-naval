import { SectionWrapper } from "../../components/ui/SectionWrapper";
import { FaqBubble } from "../../components/ui/FaqBubble";
import { FaqCategoryGrid } from "../../components/ui/FaqCategoryGrid";
import { data } from "../../mocks/data";

/**
 * FAQ page — page-level SectionWrapper (h1) with:
 *   1. A 4-up category grid (the signature element): the dimensions a
 *      customer asks about — Servicios, Tiempos, Insumos, Trabajos.
 *   2. Three chat-style FaqBubble entries laid out as a conversation:
 *      start (left), end (right), start (left). Sourced from
 *      data.home.faqs.slice(0, 3).
 */
export function Faq() {
  const faqSection = data.home.sections.faq;
  const bubbles = data.home.faqs.slice(0, 3);
  const aligns: Array<"start" | "end"> = ["start", "end", "start"];

  return (
    <SectionWrapper
      eyebrow={faqSection.eyebrow}
      title={faqSection.title}
      theme={faqSection.theme}
      titlesAlign={faqSection.titlesAlign}
      headingLevel="h1"
    >
      <div className="mb-16">
        <FaqCategoryGrid />
      </div>

      <div className="flex flex-col gap-12">
        {bubbles.map((bubble, index) => (
          <FaqBubble
            key={bubble.id}
            question={bubble.q}
            answer={bubble.a}
            align={aligns[index]}
          />
        ))}
      </div>
    </SectionWrapper>
  );
}
