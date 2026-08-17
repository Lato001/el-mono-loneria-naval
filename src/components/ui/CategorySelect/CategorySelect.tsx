import type { CategorySelectProps } from "./CategorySelect.types";
import type { Categoria } from "../../../types/trabajo";

export function CategorySelect({ value, options, onChange }: CategorySelectProps) {
  return (
    <label className="w-full max-w-sm " htmlFor="categoria-select">
      <select
        id="categoria-select"
        name="categoria"
        value={value}
        onChange={(e) => onChange(e.target.value as Categoria)}
        className={`
          w-full max-w-72 appearance-none
          bg-sc-chalk 
          text-sc-ocean-blue
          font-poppins
          ring-1
          ring-sc-chalk/50
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
        `}
        aria-label="Categoría de trabajo"
      >
        <option value="" disabled className="bg-sc-chalk  text-pr-hero-blue text-md font-semibold">
          Filtrar Categoria
        </option>
        {options.map((categoria) => (
          <option key={categoria} value={categoria} className="bg-sc-chalk  text-pr-hero-blue text-md font-semibold">
            {categoria.charAt(0).toUpperCase() + categoria.slice(1).replace(/-/g, " ")}
          </option>
        ))}
      </select>
    </label>
  );
}