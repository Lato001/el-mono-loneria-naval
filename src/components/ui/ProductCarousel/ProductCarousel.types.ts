export interface Product {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
}

export interface ProductCarouselProps {
  items: Product[];
  ariaLabel: string;
  id: string;
  onQuotationOpen?: (product: Product) => void;
}
