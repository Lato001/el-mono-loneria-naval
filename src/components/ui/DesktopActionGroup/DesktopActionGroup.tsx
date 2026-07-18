import { Button } from "../Button";
import { data } from "../../../mocks/data";
import type { DesktopActionGroupProps } from "./DesktopActionGroup.types";

/**
 * DesktopActionGroup — desktop-only inline action group.
 *
 * Rendered as a sibling of <CatalogTabs> inside <div id="tabs"> in Products.tsx.
 * Hidden on mobile (md:flex) where the ActionBar takes over.
 * Selected-count badge: rendered on the Presupuestar button's upper-right
 * corner when `selectedCount > 0`.
 */
export function DesktopActionGroup({
  selectedCount,
  onPresupuestar,
  presupuestarDisabled,
  onClear,
}: DesktopActionGroupProps) {
  const badge = selectedCount > 0 ? selectedCount : undefined;

  return (
    <div
      role="group"
      aria-label={data.ui.desktopActionGroupLabel}
      className="mx-auto flex max-w-295 items-center gap-2 px-6 hidden md:flex"
    >
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
        badge={badge}
      >
        {data.ui.quoteLabel}
      </Button>
    </div>
  );
}
