import { useCallback, useRef, type KeyboardEvent } from "react";
import { Button } from "../Button";
import { SelectionCounter } from "../SelectionCounter";
import type { CatalogTabsProps } from "./CatalogTabs.types";

export function CatalogTabs({
  categories,
  activeId,
  onSelect,
  topOffset = 56,
  selectedCount,
  onPresupuestar,
  presupuestarDisabled,
}: CatalogTabsProps) {
  const tablistRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      const tabs = categories;
      const currentIndex = tabs.findIndex((t) => t.id === activeId);
      if (currentIndex === -1) return;

      let nextIndex = currentIndex;

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
      const tabButtons = tablistRef.current?.querySelectorAll<HTMLButtonElement>(
        '[role="tab"]',
      );
      tabButtons?.[nextIndex]?.focus();
    },
    [categories, activeId, onSelect],
  );

  return (
    <div
      ref={tablistRef}
      role="tablist"
      aria-label="Categorías de productos"
      className="sticky z-40 border-b border-sc-ocean-blue/10 bg-sc-chalk"
      style={{ top: topOffset }}
      onKeyDown={handleKeyDown}
    >
      <div className="mx-auto flex max-w-295 items-center gap-3">
        <div className="flex flex-1 gap-0 overflow-x-auto px-6">
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
                    ? "border-pr-aquamarine font-bold text-sc-ocean-blue"
                    : "border-transparent text-sc-ocean-blue/60 hover:text-sc-ocean-blue"
                } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pr-aquamarine`}
              >
                {tab.name}
              </button>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center gap-2 pr-6">
          <SelectionCounter count={selectedCount} />
          <Button
            variant="primary"
            size="sm"
            onClick={onPresupuestar}
            disabled={presupuestarDisabled}
            ariaLabel="Presupuestar productos seleccionados"
          >
            Presupuestar
          </Button>
        </div>
      </div>
    </div>
  );
}
