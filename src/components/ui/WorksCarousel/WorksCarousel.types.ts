export interface WorksCarouselImage {
  src: string;
  alt: string;
  originalIndex: number;
}

export interface WorksCarouselProps {
  images: WorksCarouselImage[];
  onThumbSelect: (originalIndex: number) => void;
}