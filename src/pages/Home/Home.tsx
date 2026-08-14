import { Hero } from "../../components/layout";
import {
  Accordion,
  LinkButton,
  SectionWrapper,
  SplitCards,
} from "../../components/ui";
import Masonry from "../../components/ui/Masonry/Masonry";
import { SplitReviews } from "../../components/ui/SplitReviews/SplitReviews";
import type { MasonryItem } from "../../mocks/types";
import { data } from "../../mocks/data";
import { PATHS } from "../../routes/routes";

// ── Nuevos imports para el masonry de la home ──────────────────────────────
import capota01 from "../../assets/img/works/capota/capota-01.webp";
import carpa01 from "../../assets/img/works/carpa/carpa-01.webp";
import cerramiento01 from "../../assets/img/works/cerramiento/cerramiento-01.webp";
import toneau01 from "../../assets/img/works/toneau/toneau-01.webp";


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

//MAPEO DE MASONRY
const masonryImageMap: Record<string, string> = {
  "capota-01": capota01,
  "carpa-01": carpa01,
  "cerramiento-01": cerramiento01,
  "toneau-01": toneau01,
};

const splitCardsImageMap: Record<string, string> = heroImageMap;

const homeMasonryItems: MasonryItem[] = data.home.masonryItems.map((item) => ({
  ...item,
  img: masonryImageMap[item.img] ?? (() => {
    if (import.meta.env.DEV) console.warn(`[masonry] imagen no encontrada para key: "${item.img}"`);
    return "";
  })(),
  eyebrow: item.title ?? "Trabajos a medida",
  chips: ["A medida", "Lona reforzada"],
}));

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
        videos={data.home.hero.videos}
      />
      <div className="section-navy-gradient">
        <SectionWrapper
        gradientVariant="hero-to-navy"
          className="!bg-transparent"
          titlesAlign={data.home.sections.whatWeOffer.titlesAlign}
          eyebrow={data.home.sections.whatWeOffer.eyebrow}
          eyebrowDash
          title={data.home.sections.whatWeOffer.title}
          subtitle="PLACEHOLDER — subtítulo opcional. Productos y trabajos a medida para tu embarcación."
        >
          <SplitCards
            items={data.home.splitCards}
            imageMap={splitCardsImageMap}
          />
        </SectionWrapper>
        <SectionWrapper
          gradientVariant="navy-to-hero"
          className="!bg-transparent"
          titlesAlign={data.home.sections.aboutUs.titlesAlign}
          eyebrow={data.home.sections.aboutUs.eyebrow}
          eyebrowDash
          title={data.home.sections.aboutUs.title}
          subtitle="PLACEHOLDER — subtítulo opcional. Hecho a mano en nuestro taller de Tigre."
        >
          <div className="pb-10">
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
          </div>
          <div className="flex justify-center">
            <LinkButton
              type="Redirect"
              text="Ver mas trabajos..."
              theme="light"
              path={PATHS.WORKS}
              className="mt-10 !px-8 !py-3 !rounded-full "
            />
          </div>
        </SectionWrapper>
      </div>
      
      <SectionWrapper
        gradientVariant="hero-to-navy"
        titlesAlign={data.home.sections.testimonials.titlesAlign}
        eyebrow={data.home.sections.testimonials.eyebrow}
        title={data.home.sections.testimonials.title}
      >
        <SplitReviews></SplitReviews>
        <div className=" mt-10 flex justify-center">
          <LinkButton
            type="Google"
            text="Ver Reseñas"
            theme="light"
            url="https://maps.app.goo.gl/5yJprtv3uSdtv13M7"
          />
        </div>
      </SectionWrapper>
      <SectionWrapper
      className="pb-40"
      gradientVariant="navy-to-hero"
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
