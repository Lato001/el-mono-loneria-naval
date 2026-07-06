export interface StackedCard {
  id: string;
  title: string;
  description: string;
  color?: string;
}

export interface StackedCarouselProps {
  items: StackedCard[];
}
