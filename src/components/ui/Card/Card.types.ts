export interface CardProps {
  id?: string;
  title?: string;
  description?: string;
  badge?: string;
  imageSrc?: string;
  className?: string;
  imageClassName?: string;
  /** How the photo fits its frame. `cover` crops to fill; `contain` shows the whole image. */
  imageFit?: "cover" | "contain";
  color?: string;
  badgeClassName?: string;
  selected?: boolean;
  onSelectChange?: (next: boolean) => void;
}
