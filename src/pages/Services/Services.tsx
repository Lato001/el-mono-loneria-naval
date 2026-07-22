import { useState } from "react";
import { SectionHero, SectionTabs, SectionWrapper, RotatingCard } from "../../components/ui";
import { data } from "../../mocks/data";
import type { ServiceSection } from "../../mocks/types";
import herobg from "../../assets/backgrounds/formas-olas-sec.svg";

/**
 * Services page — hero + sticky category tabs + a content area
 * (SectionWrapper + RotatingCard) that swaps when the active tab changes.
 * The first tab is active on initial render.
 */
export function Services() {
  const [activeId, setActiveId] = useState<string>(
    data.servicesPage.tabs[0]?.id ?? "",
  );

  const activeTab =
    data.servicesPage.tabs.find((t) => t.id === activeId) ??
    data.servicesPage.tabs[0];

  const contentByTab = data.servicesPage.content as Record<string, ServiceSection>;
  const activeContent = contentByTab[activeTab.id];

  return (
    <>
      <SectionHero
        title={data.ui.servicesHeroTitle}
        img={herobg}
        description={data.ui.servicesHeroDescription}
      />
      <SectionTabs
        categories={data.servicesPage.tabs}
        activeId={activeTab.id}
        onSelect={setActiveId}
        ariaLabel={data.ui.servicesCategoriesLabel}
      />

      <SectionWrapper eyebrow="Servicios" title={activeTab.name} theme="light">
        <RotatingCard items={activeContent.items} />
      </SectionWrapper>
    </>
  );
}
