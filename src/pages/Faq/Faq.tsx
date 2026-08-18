import { useEffect, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";
import { SectionWrapper } from "../../components/ui/SectionWrapper";
import { FaqBubble } from "../../components/ui/FaqBubble";
import { FaqCategoryGrid } from "../../components/ui/FaqCategoryGrid";
import { Modal } from "../../components/ui/Modal";
import { data } from "../../mocks/data";
import type { FaqCategory, FaqItem } from "../../mocks/types";
import type { FaqBubbleDialogData } from "../../components/ui/FaqBubble";

import faqimg01 from "../../assets/img/products/hilos/thumbs/hilo-negro.webp";
import faqimg02 from "../../assets/img/products/correas/thumbs/correa-negra.webp";
import faqimg03 from "../../assets/img/products/carros/thumbs/perro-n5-negro.webp";
import faqimg04 from "../../assets/img/works/capota/thumbs/capota-01.webp";

import insumosLogo from "../../assets/logos/icons/insumos/insumos-rounded.svg";
import serviciosLogo from "../../assets/logos/icons/servicios/servicios-rounded.svg";
import tiemposLogo from "../../assets/logos/icons/tiempos/tiempos-rounded.svg";
import trabajosLogo from "../../assets/logos/icons/trabajos/trabajos-rounded.svg";

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
 * The id used for in-page anchors. Must be a valid HTML id (no spaces).
 * The grid calls scrollIntoView on the matching <section id={...}>.
 */
const CATEGORY_ANCHOR_PREFIX = "faq-cat-";

/**
 * Chat-side alternation per category. Keeps the conversation rhythm
 * across sections even when a category holds more than one bubble.
 */
const CATEGORY_ALIGNS: Record<FaqCategory, "start" | "end"> = {
  insumos: "start",
  tiempos: "end",
  servicios: "start",
  trabajos: "end",
};

// Stand-in real images, one per FAQ entry. Swap with category-specific
// photography when it lands.
const BUBBLE_IMAGES: Record<string, string> = {
  faq1: faqimg01,
  faq2: faqimg02,
  faq3: faqimg03,
  faq4: faqimg04,
};

/**
 * Watermark logo per category. The same brand icons used in
 * FaqCategoryGrid, rendered faded behind each chat pair.
 */
const CATEGORY_WATERMARKS: Record<FaqCategory, string> = {
  insumos: insumosLogo,
  tiempos: tiemposLogo,
  servicios: serviciosLogo,
  trabajos: trabajosLogo,
};

/**
 * Group the flat list of FAQs into a per-category structure, preserving
 * the order they appear in data.home.faqs within each category.
 */
function groupByCategory(faqs: FaqItem[]): Array<{
  category: FaqCategory;
  bubbles: FaqItem[];
}> {
  const order: FaqCategory[] = ["insumos", "tiempos", "servicios", "trabajos"];
  const buckets = new Map<FaqCategory, FaqItem[]>();
  for (const f of faqs) {
    if (!buckets.has(f.category)) buckets.set(f.category, []);
    buckets.get(f.category)!.push(f);
  }
  return order
    .filter((c) => buckets.has(c))
    .map((c) => ({ category: c, bubbles: buckets.get(c)! }));
}

/**
 * FAQ page — page-level SectionWrapper (h1) with:
 *   1. A 4-up category grid (the signature element). Each tile is a
 *      <button> that scrolls smoothly to the matching category section.
 *   2. One SectionWrapper per category, each holding 1+ chat-style
 *      FaqBubble entries. Categories are alternated start/end so the
 *      conversation rhythm reads naturally.
 *   3. On mobile, tapping each bubble's ImgCard opens a sheet dialog with
 *      the question, answer and image.
 */
export function Faq() {
  useDocumentMeta({
    title: "Preguntas frecuentes",
    description:
      "Materiales, plazos de entrega, tipos de trabajo y servicios. Todo lo que necesitás saber antes de pedir tu presupuesto.",
    path: "/faq",
  });

  const faqSection = data.home.sections.faq;
  const grouped = groupByCategory(data.home.faqs);

  // Bubble whose question+answer are shown in the mobile sheet dialog.
  // null = dialog closed. Set when a mobile peek button is tapped.
  const [openFaq, setOpenFaq] = useState<FaqBubbleDialogData | null>(null);

  // The ImgCard button that opened the dialog. This dialog opens
  // programmatically (no Radix DialogTrigger), so Radix cannot restore
  // focus to a trigger on close — we keep the button ourselves and
  // restore focus when the dialog closes.
  const peekTriggerRef = useRef<HTMLButtonElement | null>(null);

  const handlePeekTap = (
    data: FaqBubbleDialogData,
    event: ReactMouseEvent<HTMLButtonElement>,
  ) => {
    peekTriggerRef.current = event.currentTarget;
    setOpenFaq(data);
  };

  useEffect(() => {
    if (!openFaq) peekTriggerRef.current?.focus();
  }, [openFaq]);

  const handleCategoryClick = (id: FaqCategory) => {
    // In jsdom (tests) document is available but scrolling is a no-op.
    // In the browser this is the actual smooth scroll.
    document
      .getElementById(`${CATEGORY_ANCHOR_PREFIX}${id}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <SectionWrapper
      eyebrow={faqSection.eyebrow}
      title={faqSection.title}
      theme={faqSection.theme}
      titlesAlign={faqSection.titlesAlign}
      headingLevel="h1"
      className="overflow-x-clip"
      gradientVariant="navy-to-hero"
    >
      <div className="mb-16">
        <FaqCategoryGrid onSelect={handleCategoryClick} />
      </div>

      <div className="flex flex-col gap-12">
        {grouped.map(({ category, bubbles }) => (
          <SectionWrapper
            key={category}
            id={`${CATEGORY_ANCHOR_PREFIX}${category}`}
            title={category}
            titlesAlign={faqSection.titlesAlign}
            className="!bg-transparent"
          >
            <div className="flex flex-col gap-12">
              {bubbles.map((bubble) => (
                <FaqBubble
                  key={bubble.id}
                  question={bubble.q}
                  answer={bubble.a}
                  align={CATEGORY_ALIGNS[category]}
                  image={{
                    src: BUBBLE_IMAGES[bubble.id],
                    alt: CATEGORY_LABELS[category],
                  }}
                  peekIcon={CATEGORY_WATERMARKS[category]}
                  onPeekTap={handlePeekTap}
                />
              ))}
            </div>
          </SectionWrapper>
        ))}
      </div>

      {/* Mobile sheet dialog: shows the tapped bubble's question, answer and image */}
      <Modal
        open={Boolean(openFaq)}
        onOpenChange={(open) => {
          if (!open) setOpenFaq(null);
        }}
        variant="sheet"
        size="lg"
        title={openFaq?.question}
        className="bg-sc-ocean-blue"
        textColor="light"
      >
        {openFaq && (
          <div className="flex flex-col gap-4 pt-2">
            <div
              className={`
                w-full
                bg-sc-sky-blue
                text-white
                rounded-[0_48px_48px_48px]
                px-6 py-5
              `}
            >
              <p className="text-lg font-semibold font-poppins">
                {openFaq.answer}
              </p>
            </div>

            {openFaq.image?.src && (
              <img
                src={openFaq.image.src}
                alt={openFaq.image.alt}
                className="max-h-60 w-full rounded-xl object-cover"
              />
            )}
          </div>
        )}
      </Modal>
    </SectionWrapper>
  );
}