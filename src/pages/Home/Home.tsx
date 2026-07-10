import { Hero } from "../../components/layout";
import {
  HomeSection,
  BrandMarquee,
  Card,
  SplitCardsSection,
  ReviewCard,
  AboutSection,
} from "../../components/ui";
import { data } from "../../mocks/data";
import type { Section } from "../../mocks/data";
import type { Review } from "../../types/review";
import icon from "../../assets/logos/elmono/isotype-mono-color.svg";

// TODO: replace with real content for top-level category cards
const splitCards = [
  {
    title: "Productos",
    /* TODO: replace with real description */
    description: "TODO: descripci\u00f3n de productos",
    badge: "Entrega Inmediata",
    badgeClassName: "bg-pr-aquamarine",
    /* TODO: replace with real CTA label */
    ctaLabel: "Ver Cat\u00e1logo",
  },
  {
    title: "Servicios",
    /* TODO: replace with real description */
    description: "TODO: descripci\u00f3n de servicios",
    badge: "A Medida",
    badgeClassName: "bg-white",
    /* TODO: replace with real CTA label */
    ctaLabel: "Ver M\u00e1s",
  },
];

export function Home() {
  const homeSections = data.Home.Sections;
  const reviews = data.Home.Reviews;

  return (
    <>
      <Hero />
      <BrandMarquee />
      <div className="bg-sc-ocean-blue py-10">
        <SplitCardsSection>
          {splitCards.map((c) => (
            <Card key={c.title} {...c} />
          ))}
        </SplitCardsSection>
      </div>

      {/* Dynamic sections from data — discriminated union on `kind` */}
      {homeSections.map((section: Section) => {
        switch (section.kind) {
          case "reviews":
            return (
              <HomeSection
                key={section.id}
                eyebrow={section.eyebrow}
                title={section.title}
                icon={icon}
              >
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                  {reviews.slice(0, 3).map((r: Review) => (
                    <ReviewCard key={r.id} {...r} />
                  ))}
                </div>
              </HomeSection>
            );
          case "aboutus":
            return (
              <AboutSection
                key={section.id}
                eyebrow={section.eyebrow}
                title={section.title}
                content={section.content}
                image={section.image}
                imageAlt={section.imageAlt}
                highlights={section.highlights}
                cta={section.cta}
              />
            );
          default: {
            const _exhaustive: never = section;
            return _exhaustive;
          }
        }
      })}
    </>
  );
}
