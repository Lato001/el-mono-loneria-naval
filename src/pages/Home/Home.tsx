import { Hero } from "../../components/layout";
import {
  Accordion,
  AboutSection,
  SectionWrapper,
  SplitCards,
} from "../../components/ui";
import { SplitReviews } from "../../components/ui/SplitReviews/SplitReviews";
import { data } from "../../mocks/data";

// ─── Service images (auto-discovered via Vite glob) ────────────────────
const serviceImages = import.meta.glob(
  "../../assets/img/services/*",
  { eager: true, import: "default" },
) as Record<string, string>;

const heroImageMap: Record<string, string> = Object.fromEntries(
  Object.entries(serviceImages).map(([path, url]) => [
    path.split("/").pop()!.replace(/\.[^.]+$/, ""),
    url,
  ]),
);

const heroImages = data.home.hero.images.map((img) => ({
  src: heroImageMap[img.src],
  alt: img.alt,
}));

const splitCardsImageMap: Record<string, string> = heroImageMap;

export function Home() {
  return (
    <>
      <Hero
        eyebrow={data.home.hero.eyebrow}
        titlePrefix={data.home.hero.titlePrefix}
        titleHighlight={data.home.hero.titleHighlight}
        description={data.home.hero.description}
        primaryCta={data.home.hero.primaryCta}
        secondaryCta={data.home.hero.secondaryCta}
        images={heroImages}
      />
      <SectionWrapper
        theme={data.home.sections.whatWeOffer.theme}
        titlesAlign={data.home.sections.whatWeOffer.titlesAlign}
        eyebrow={data.home.sections.whatWeOffer.eyebrow}
        title={data.home.sections.whatWeOffer.title}
      >
        <SplitCards
          items={data.home.splitCards}
          imageMap={splitCardsImageMap}
        />
      </SectionWrapper>
      <SectionWrapper
        theme={data.home.sections.aboutUs.theme}
        titlesAlign={data.home.sections.aboutUs.titlesAlign}
        eyebrow={data.home.sections.aboutUs.eyebrow}
        title={data.home.sections.aboutUs.title}
      >
        <AboutSection
          showControls
          description={data.home.aboutSection.description}
          cta={data.home.aboutSection.cta}
        />
      </SectionWrapper>

      <SectionWrapper
        theme={data.home.sections.testimonials.theme}
        titlesAlign={data.home.sections.testimonials.titlesAlign}
        eyebrow={data.home.sections.testimonials.eyebrow}
        title={data.home.sections.testimonials.title}
      >
        <SplitReviews></SplitReviews>
      </SectionWrapper>

      <SectionWrapper
        theme={data.home.sections.faq.theme}
        titlesAlign={data.home.sections.faq.titlesAlign}
        eyebrow={data.home.sections.faq.eyebrow}
        title={data.home.sections.faq.title}
      >
        <Accordion items={data.home.faqs} />
      </SectionWrapper>
    </>
  );
}
