import { useState } from "react";
import {
  RotatingCard,
  SectionTabs,
  SectionWrapper,
} from "../../components/ui";
import { data } from "../../mocks/data";
import type { ServiceSection } from "../../mocks/types";

/**
 * Services page — page-level SectionWrapper (h1) for the hero copy,
 * the sticky SectionTabs row, and a content SectionWrapper (h2) whose
 * title and content swap with the active tab. The first tab is the default.
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
      <SectionWrapper
        eyebrow="Servicios"
        title={data.ui.servicesHeroTitle}
        theme="light"
        titlesAlign="start"
        headingLevel="h1"
      >
        <p className="mb-8 max-w-2xl font-poppins text-base leading-relaxed text-sc-ocean-blue/70">
          {data.ui.servicesHeroDescription}
        </p>
      </SectionWrapper>

      <SectionTabs
        categories={data.servicesPage.tabs}
        activeId={activeTab.id}
        onSelect={setActiveId}
        ariaLabel={data.ui.servicesCategoriesLabel}
      />

      <SectionWrapper
        title={activeTab.name}
        theme="light"
        titlesAlign="start"
        headingLevel="h2"
      >
        <RotatingCard items={activeContent.items} />
      </SectionWrapper>
    </>
  );
}
