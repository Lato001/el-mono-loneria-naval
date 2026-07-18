import { Button } from "../Button";
import { SelectionCounter } from "../SelectionCounter";
import { data } from "../../../mocks/data";
import type { DesktopActionGroupProps } from "./DesktopActionGroup.types";

/**
 * DesktopActionGroup — desktop-only inline action group.
 *
 * Rendered as a sibling of <CatalogTabs> inside <div id="tabs"> in Products.tsx.
 * Hidden on mobile (md:flex) where the ActionBar takes over.
 */
export function DesktopActionGroup({
  selectedCount,
  onPresupuestar,
  presupuestarDisabled,
  onClear,
}: DesktopActionGroupProps) {
  return (
    <div
      role="group"
      aria-label={data.ui.desktopActionGroupLabel}
      className="mx-auto flex max-w-295 items-center gap-2 px-6 hidden md:flex"
    >
      <SelectionCounter count={selectedCount} />
      <Button
        variant="danger"
        size="md"
        onClick={onClear}
        disabled={presupuestarDisabled}
        ariaLabel={data.ui.clearListLabel}
      >
        {data.ui.clearList}
      </Button>
      <Button
        size="md"
        onClick={onPresupuestar}
        disabled={presupuestarDisabled}
        ariaLabel={data.ui.quoteCartLabel}
        className="ml-auto"
      >
        {data.ui.quoteLabel}
      </Button>
    </div>
  );
}
