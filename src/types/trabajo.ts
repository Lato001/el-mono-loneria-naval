/**
 * Trabajo (Work) types for the Works section redesign.
 * Defines the category taxonomy and the trabajo entity.
 */

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
}