import { SectionHero, SectionTabs } from "../../components/ui";
import { data } from "../../mocks/data";
import herobg from "../../assets/backgrounds/formas-olas-sec.svg";
import type { Tab } from "../../components/ui/SectionTabs/SectionTabs.types";

export function Services() {
  const tabs: Tab[] = [
    { id: "capotas", name: "Capotas" },
    { id: "cerramientos", name: "Cerramientos" },
    { id: "tonos", name: "Tonos" },
  ];
  return (
    <>
      <SectionHero
        title={"NUESTROS SERVICIOS"}
        img={herobg}
        description={data.ui.catalogHeroDescription}
      />
      <SectionTabs categories={tabs} />
    </>
  );
}
