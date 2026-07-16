import heroImg1 from "../../assets/img/services/services-01.jpg";
import heroImg2 from "../../assets/img/services/services-02.jpg";
import heroImg3 from "../../assets/img/services/services-04.jpg";
import heroImg4 from "../../assets/img/services/services-05.jpg";
import { Hero } from "../../components/layout";
import {
  Accordion,
  AboutSection,
  SectionWrapper,
  SplitCards,
} from "../../components/ui";
import { SplitReviews } from "../../components/ui/SplitReviews/SplitReviews";
import { data } from "../../mocks/data";

const heroImageMap: Record<string, string> = {
  "services-01.jpg": heroImg1,
  "services-02.jpg": heroImg2,
  "services-04.jpg": heroImg3,
  "services-05.jpg": heroImg4,
};

const heroImages = data.home.hero.images.map((img) => ({
  src: heroImageMap[img.src],
  alt: img.alt,
}));

const splitCardsImageMap: Record<string, string> = {
  "services-02.jpg": heroImg2,
  "services-04.jpg": heroImg3,
};

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
