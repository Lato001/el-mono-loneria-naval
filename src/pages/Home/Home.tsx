import { Hero } from "../../components/layout";
import {
  Accordion,
  LinkButton,
  SectionWrapper,
  SplitCards,
  WhatsappButton,
} from "../../components/ui";
import { SplitReviews } from "../../components/ui/SplitReviews/SplitReviews";
import { StackedCards } from "../../components/ui/StackedCards/StackedCards";
import { data } from "../../mocks/data";

// ─── Service images (auto-discovered via Vite glob) ────────────────────
const serviceImages = import.meta.glob("../../assets/img/services/*", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const heroImageMap: Record<string, string> = Object.fromEntries(
  Object.entries(serviceImages).map(([path, url]) => [
    path
      .split("/")
      .pop()!
      .replace(/\.[^.]+$/, ""),
    url,
  ]),
);

const splitCardsImageMap: Record<string, string> = heroImageMap;

export function Home() {
  return (
    <>
      <WhatsappButton />
      <Hero
        eyebrow={data.home.hero.eyebrow}
        titlePrefix={data.home.hero.titlePrefix}
        titleHighlight={data.home.hero.titleHighlight}
        description={data.home.hero.description}
        primaryCta={data.home.hero.primaryCta}
        secondaryCta={data.home.hero.secondaryCta}
        videos={data.home.hero.videos}
      />
      <SectionWrapper
        theme="light"
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
        theme="dark"
        className="pb-32"
        titlesAlign={data.home.sections.aboutUs.titlesAlign}
        eyebrow={data.home.sections.aboutUs.eyebrow}
        title={data.home.sections.aboutUs.title}
      >
        <StackedCards
          cards={data.home.stackedCards.map((card) => ({
            id: card.id,
            image: heroImageMap[card.imageKey],
            alt: card.title,
            title: card.title,
            description: card.description,
          }))}
        />
      </SectionWrapper>

      <SectionWrapper
        theme="light"
        titlesAlign={data.home.sections.testimonials.titlesAlign}
        eyebrow={data.home.sections.testimonials.eyebrow}
        title={data.home.sections.testimonials.title}
      >
        <SplitReviews></SplitReviews>
        <div className=" mt-10 flex justify-center">
          <LinkButton
            type="Google"
            text="Ver Reseñas"
            className="bg-sc-ocean-blue"
            url="https://maps.app.goo.gl/5yJprtv3uSdtv13M7"
          />
        </div>
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
