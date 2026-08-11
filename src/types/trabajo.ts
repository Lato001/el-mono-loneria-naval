/**
 * Trabajo (Work) types for the Works section redesign.
 * Defines the category taxonomy and the trabajo entity.
 */

/**
 * Standout point for a trabajo, rendered as a small badge with its own icon.
 * `icono` is a Tabler icon key resolved in WorksSection; `texto` is the Spanish UI text.
 */
export interface Cualidad {
  icono: string; // Tabler icon key resolved in WorksSection
  texto: string;
}

export type Categoria =
  | "toneau"
  | "cubrevidrios"
  | "cubre-fly"
  | "cerramientos"
  | "carpas"
  | "capotas"
  | "motos-de-agua"
  | "gomones"
  | "bitacora"
  | "extra";

export interface Trabajo {
  id: string;
  categoria: Categoria;
  titulo: string;
  descripcion: string;
  imagenes: string[]; // imageKeys resolved via imageMap in Works.tsx
  destacado?: boolean;
  cualidades?: Cualidad[]; // optional highlight badges, each with its own icon
}