import { useState } from "react";
import {
  SectionHero,
  SectionTabs,
  SectionWrapper,
  StackedCarousel,
} from "../../components/ui";
import { data } from "../../mocks/data";
import type { ServiceSection } from "../../mocks/types";
import herobg from "../../assets/backgrounds/formas-olas-sec.svg";

/**
 * Services page — hero + sticky category tabs + a single dynamic
 * content area (SectionWrapper + StackedCarousel with autoplay) that
 * swaps when the active tab changes. The first tab is active on
 * initial render (no tab selected → first tab is the default).
 */
export function Services() {
  const [activeId, setActiveId] = useState<string | null>(
    data.servicesPage.tabs[0]?.id ?? null,
  );

  // Fall back to the first tab if the active id is unknown (defensive).
  const activeTab =
    data.servicesPage.tabs.find((t) => t.id === activeId) ??
    data.servicesPage.tabs[0];

  // The data is keyed by tab id, but TypeScript narrows `content` to
  // the specific keys from the literal object, so we cast to the index
  // signature for the lookup.
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

      <SectionWrapper
        eyebrow="Servicios"
        title={activeTab.name}
        theme="light"
      >
        <StackedCarousel
          items={activeContent.items}
          autoplay
          interval={5000}
        />
      </SectionWrapper>
    </>
  );
}
