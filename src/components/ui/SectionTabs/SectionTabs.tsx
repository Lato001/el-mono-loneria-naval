import { useCallback, useRef, type KeyboardEvent } from "react";
import { data } from "../../../mocks/data";
import type { SectionTabsProps } from "./SectionTabs.types";

export function SectionTabs({
  categories,
  activeId,
  onSelect,
  ariaLabel = data.ui.categoriesLabel,
  selectedCounts,
}: SectionTabsProps) {
  const tablistRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      const tabs = categories;
      const currentIndex = tabs.findIndex((t) => t.id === activeId);
      if (currentIndex === -1) return;

      let nextIndex: number;

      switch (e.key) {
        case "ArrowRight":
          nextIndex = (currentIndex + 1) % tabs.length;
          break;
        case "ArrowLeft":
          nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
          break;
        case "Home":
          nextIndex = 0;
          break;
        case "End":
          nextIndex = tabs.length - 1;
          break;
        default:
          return;
      }

      e.preventDefault();
      const nextTab = tabs[nextIndex];
      onSelect?.(nextTab.id);

      // Move focus to the next tab button
      const tabButtons =
        tablistRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
      tabButtons?.[nextIndex]?.focus();
    },
    [categories, activeId, onSelect],
  );

  return (
    <div
      ref={tablistRef}
      role="tablist"
      aria-label={ariaLabel}
      className="border-b border-white bg-sc-ocean-blue"
      onKeyDown={handleKeyDown}
    >
      <div className="mx-auto flex max-w-295 items-center gap-3 overflow-x-auto scrollbar-hide">
        <div className="flex shrink-0 gap-0 px-6">
          {categories.map((tab) => {
            const isActive = tab.id === activeId;
            return (
              <button
                key={tab.id}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={tab.id}
                tabIndex={isActive ? 0 : -1}
                onClick={() => onSelect?.(tab.id)}
                className={`font-poppins shrink-0 cursor-pointer border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-pr-aquamarine font-bold text-white"
                    : "border-transparent text-white hover:text-pr-aquamarine"
                } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pr-aquamarine`}
              >
                {tab.name}
                {selectedCounts?.[tab.id] != null &&
                  selectedCounts[tab.id] > 0 && (
                    <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-pr-aquamarine px-1.5 text-xs font-bold text-pr-hero-blue">
                      {selectedCounts[tab.id]}
                    </span>
                  )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
