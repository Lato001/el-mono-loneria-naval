import type { Categoria } from "../../../types/trabajo";

export interface CategorySelectProps {
  value: Categoria;
  options: Categoria[];
  onChange: (categoria: Categoria) => void;
}