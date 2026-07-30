import { Hero } from "../../components/layout";
import {
  Accordion,
  LinkButton,
  SectionWrapper,
  SplitCards,
  WhatsappButton,
} from "../../components/ui";
import Masonry from "../../components/ui/Masonry/Masonry";
import { SplitReviews } from "../../components/ui/SplitReviews/SplitReviews";
import type { MasonryItem } from "../../mocks/types";
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

const heroImages = data.home.hero.images.map((img) => ({
  src: heroImageMap[img.src],
  alt: img.alt,
}));

const splitCardsImageMap: Record<string, string> = heroImageMap;

const homeMasonryItems: MasonryItem[] = data.home.masonryItems.map((item) => ({
  ...item,
  img: heroImageMap[item.img] ?? "",
}));

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
        images={heroImages}
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
        titlesAlign={data.home.sections.aboutUs.titlesAlign}
        eyebrow={data.home.sections.aboutUs.eyebrow}
        title={data.home.sections.aboutUs.title}
      >
        <Masonry
          items={homeMasonryItems}
          variant="mosaic"
          ease="power3.out"
          duration={0.6}
          stagger={0.05}
          animateFrom="bottom"
          scaleOnHover
          hoverScale={0.95}
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
