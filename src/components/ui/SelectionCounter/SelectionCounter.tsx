import type { SelectionCounterProps } from "./SelectionCounter.types";

export function SelectionCounter({ count }: SelectionCounterProps) {
  if (count === 0) return null;
  return (
    <span
      aria-live="polite"
      aria-label={`${count} productos seleccionados`}
      className="relative inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-pr-hero-blue px-1 text-xs font-semibold text-white shadow-sm"
    >
      {count}
    </span>
  );
}
