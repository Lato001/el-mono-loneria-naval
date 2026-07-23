import { SectionWrapper } from "../../components/ui/SectionWrapper";
import { FaqBubble } from "../../components/ui/FaqBubble";
import { FaqCategoryGrid } from "../../components/ui/FaqCategoryGrid";
import { data } from "../../mocks/data";
import type { FaqCategory } from "../../mocks/types";

import services01 from "../../assets/img/services/services-01.jpg";
import services02 from "../../assets/img/services/services-02.jpg";
import services04 from "../../assets/img/services/services-04.jpg";

/**
 * Map of FAQ category id → placeholder label. The label doubles as the
 * image alt text. Prefixed with "Imagen de" so the placeholder text
 * stays unique against the category-grid labels (which use the bare
 * category name).
 */
const CATEGORY_LABELS: Record<FaqCategory, string> = {
  insumos: "Imagen de Materiales",
  servicios: "Imagen de Servicios",
  tiempos: "Imagen de Tiempos",
  trabajos: "Imagen de Trabajos",
};

/**
 * FAQ page — page-level SectionWrapper (h1) with:
 *   1. A 4-up category grid (the signature element): the dimensions a
 *      customer asks about — Servicios, Tiempos, Insumos, Trabajos.
 *   2. Three chat-style FaqBubble entries laid out as a conversation:
 *      start (left), end (right), start (left). Sourced from
 *      data.home.faqs.slice(0, 3). Each bubble is wrapped in a
 *      per-category SectionWrapper and carries an ImgCard with a
 *      real image from src/assets/img/services (as a stand-in until
 *      category-specific photography is available).
 */
export function Faq() {
  const faqSection = data.home.sections.faq;
  const bubbles = data.home.faqs.slice(0, 3);
  const aligns: Array<"start" | "end"> = ["start", "end", "start"];

  // Stand-in real images, one per bubble. Swap with category-specific
  // photography when it lands.
  const bubbleImages = [services01, services02, services04];

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
          <SectionWrapper
            key={bubble.id}
            title={bubble.category}
            titlesAlign={faqSection.titlesAlign}
          >
            <FaqBubble
              question={bubble.q}
              answer={bubble.a}
              align={aligns[index]}
              image={{
                src: bubbleImages[index],
                alt: CATEGORY_LABELS[bubble.category],
              }}
            />
          </SectionWrapper>
        ))}
      </div>
    </SectionWrapper>
  );
}
