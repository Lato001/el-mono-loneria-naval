export interface StackedCard {
  id: string;
  image: string;
  alt: string;
  title?: string;
  description?: string;
}

export interface StackedCardsProps {
  cards: StackedCard[];
}
