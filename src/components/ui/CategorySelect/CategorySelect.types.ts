import type { Categoria } from "../../../types/trabajo";

export interface CategorySelectProps {
  /** "" means "no filter selected" — the placeholder option is shown. */
  value: Categoria | "";
  options: Categoria[];
  onChange: (categoria: Categoria) => void;
}