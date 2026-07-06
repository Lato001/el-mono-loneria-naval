import { Hero } from "../../components/layout";
import { HomeSection, ServiceGrid, BrandMarquee } from "../../components/ui";
import { data } from "../../mocks/data";

export function Home() {
  const SERVICES = data.Home.Services;
  const HOME_SECTIONS = data.Home.Sections;
  return (
    <>
      <Hero />
      <BrandMarquee />
      {HOME_SECTIONS.map((section) => (
        <HomeSection eyebrow={section.eyebrow} title={section.title}>
          {section.id === "services" && <ServiceGrid services={SERVICES} />}
        </HomeSection>
      ))}
    </>
  );
}
