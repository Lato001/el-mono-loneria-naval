import type { CategorySelectProps } from "./CategorySelect.types";
import type { Categoria } from "../../../types/trabajo";

export function CategorySelect({ value, options, onChange }: CategorySelectProps) {
  return (
    <label className="w-full max-w-xs" htmlFor="categoria-select">
      <select
        id="categoria-select"
        name="categoria"
        value={value}
        onChange={(e) => onChange(e.target.value as Categoria)}
        className="
          w-full max-w-50 appearance-none
          bg-sc-chalk
          text-pr-hero-blue
          font-poppins
          text-base font-semibold
          px-4 py-3
          rounded-xl
          hover:ring-1 hover:ring-pr-aquamarine
          shadow-md
          focus:outline-none
          focus:ring-2 focus:ring-pr-aquamarine
          focus:border-pr-aquamarine
          hover:border-pr-aquamarine/80
          transition-colors duration-200
          cursor-pointer
        "
        aria-label="Categoría de trabajo"
      >
        {options.map((categoria) => (
          <option key={categoria} value={categoria} className="bg-pr-hero-blue/90 text-sc-chalk ring-1 ring-pr-aquamarine">
            {categoria.charAt(0).toUpperCase() + categoria.slice(1).replace(/-/g, " ")}
          </option>
        ))}
      </select>
    </label>
  );
}