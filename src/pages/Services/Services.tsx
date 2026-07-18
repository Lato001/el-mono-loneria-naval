import { useState } from "react";
import { SectionHero, SectionTabs } from "../../components/ui";
import { data } from "../../mocks/data";
import type { ServiceSection } from "../../mocks/types";
import herobg from "../../assets/backgrounds/formas-olas-sec.svg";

/**
 * Services page — hero + sticky category tabs + one section per service.
 * Mirrors the Products page layout (SectionHero + SectionTabs) but the
 * content per tab is a single text block, not a product carousel.
 *
 * Tab click scrolls to the corresponding section via `scrollIntoView`
 * (same pattern as Products). The `activeId` is local state so the
 * aria-selected state stays in sync with the scroll position once the
 * IntersectionObserver hook is added in a follow-up.
 */
export function Services() {
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleTabSelect = (id: string) => {
    setActiveId(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // The data is keyed by tab id, but TypeScript narrows `content` to the
  // specific keys from the literal object, so we cast to the index
  // signature for the lookup.
  const contentByTab = data.servicesPage.content as Record<string, ServiceSection>;

  return (
    <>
      <SectionHero
        title={data.ui.servicesHeroTitle}
        img={herobg}
        description={data.ui.servicesHeroDescription}
      />

      <SectionTabs
        categories={data.servicesPage.tabs}
        activeId={activeId ?? undefined}
        onSelect={handleTabSelect}
        ariaLabel={data.ui.servicesCategoriesLabel}
      />

      <div className="bg-sc-chalk">
        {data.servicesPage.tabs.map((tab) => {
          const content = contentByTab[tab.id];
          return (
            <section
              key={tab.id}
              id={tab.id}
              className="py-16 px-6"
              style={{ scrollMarginTop: "var(--header-h, 76px)" }}
            >
              <div className="mx-auto max-w-295">
                <h2 className="font-poppins text-3xl font-bold text-sc-ocean-blue mb-4">
                  {content.title}
                </h2>
                <p className="font-poppins text-base leading-relaxed text-sc-ocean-blue/70 max-w-2xl">
                  {content.description}
                </p>
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
