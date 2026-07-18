import { Button } from "../Button";
import { SelectionCounter } from "../SelectionCounter";
import { data } from "../../../mocks/data";
import type { ActionBarProps } from "./ActionBar.types";

/**
 * ActionBar — mobile-only sticky bottom bar.
 *
 * z-index: z-30 (above page content, below CatalogTabs z-40, below Modal z-50).
 * Touch target: `min-h-11` (44px) on both buttons — defense-in-depth for
 * accessibility, independent of Button's intrinsic line-height.
 */
export function ActionBar({
  selectedCount,
  onPresupuestar,
  presupuestarDisabled,
  onClear,
}: ActionBarProps) {
  return (
    <div
      role="region"
      aria-label={data.ui.actionBarLabel}
      className="fixed inset-x-0 bottom-0 z-30 md:hidden border-t border-sc-ocean-blue/10 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom)]"
    >
      <div className="mx-auto flex max-w-295 items-center gap-3 px-4 py-3">
        <SelectionCounter count={selectedCount} />
        <Button
          variant="danger"
          size="md"
          className="min-h-11"
          onClick={onClear}
          disabled={presupuestarDisabled}
          ariaLabel={data.ui.clearListLabel}
        >
          {data.ui.clearList}
        </Button>
        <Button
          variant="primary"
          size="md"
          className="ml-auto min-h-11"
          onClick={onPresupuestar}
          disabled={presupuestarDisabled}
          ariaLabel={data.ui.quoteCartLabel}
        >
          {data.ui.quoteLabel}
        </Button>
      </div>
    </div>
  );
}
