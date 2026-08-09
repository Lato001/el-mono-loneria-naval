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
          w-full appearance-none
          bg-sc-ocean-blue
          text-pr-aquamarine
          font-poppins
          text-base
          px-4 py-3
          rounded-xl
          border-2 border-pr-aquamarine/30
          focus:outline-none
          focus:ring-2 focus:ring-pr-aquamarine
          focus:border-pr-aquamarine
          hover:border-pr-aquamarine/60
          transition-colors duration-200
          cursor-pointer
        "
        aria-label="Categoría de trabajo"
      >
        {options.map((categoria) => (
          <option key={categoria} value={categoria} className="bg-sc-ocean-blue text-pr-aquamarine">
            {categoria.charAt(0).toUpperCase() + categoria.slice(1).replace(/-/g, " ")}
          </option>
        ))}
      </select>
    </label>
  );
}