import { Hero } from "../../components/layout";
import {
  HomeSection,
  BrandMarquee,
  Card,
  SplitCardsSection,
} from "../../components/ui";
import { data } from "../../mocks/data";
import icon from "../../assets/logos/elmono/isotype-mono-color.svg";

export function Home() {
  const HOME_SECTIONS = data.Home.Sections;
  return (
    <>
      <Hero />
      <BrandMarquee />
      <div className="bg-sc-ocean-blue py-10">
        <SplitCardsSection>
          <Card
            title="Productos"
            description="una descripcion de ejemplo"
            badge="Entrega Inmediata"
            badgeClassName="bg-pr-aquamarine"
            ctaLabel="Ver Catalogo"
          />
          <Card
            title="Servicios"
            description="una descripcion de ejemplo"
            badge="A Medida"
            badgeClassName="bg-white"
            ctaLabel="Ver Mas!"
          />
        </SplitCardsSection>
      </div>
      {HOME_SECTIONS.map((section) => (
        <HomeSection
          key={section.id}
          eyebrow={section.eyebrow}
          title={section.title}
          icon={icon}
        ></HomeSection>
      ))}
    </>
  );
}
