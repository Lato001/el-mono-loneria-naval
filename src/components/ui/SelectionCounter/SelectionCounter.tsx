import type { SelectionCounterProps } from "./SelectionCounter.types";
import { data } from "../../../mocks/data";

export function SelectionCounter({ count }: SelectionCounterProps) {
  if (count === 0) return null;
  return (
    <span
      aria-live="polite"
      aria-label={`${count} ${data.ui.selectedCountLabel}`}
      className="relative inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-pr-hero-blue px-1 text-xs font-semibold text-white shadow-sm"
    >
      {count}
    </span>
  );
}
