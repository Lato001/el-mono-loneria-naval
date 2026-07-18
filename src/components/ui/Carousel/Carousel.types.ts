export interface StackedCard {
  id: string;
  title: string;
  description: string;
  color?: string;
}

export interface StackedCarouselProps {
  items: StackedCard[];
  /**
   * When true, the carousel advances automatically on a timer (like the
   * hero `ImgCard`). Autoplay pauses while the user is hovering over
   * the carousel and resumes on mouse-leave.
   */
  autoplay?: boolean;
  /** Autoplay interval in ms. Default 4000. Ignored when `autoplay` is false. */
  interval?: number;
}
