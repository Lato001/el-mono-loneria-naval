import { SectionWrapper } from "../../components/ui/SectionWrapper";
import { FaqBubble } from "../../components/ui/FaqBubble";
import { data } from "../../mocks/data";

/**
 * FAQ page — page-level SectionWrapper (h1) with 3 FaqBubble entries
 * laid out as a chat conversation: start (left), end (right), start (left).
 * The bubbles are pulled from the first 3 entries of data.home.faqs.
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
