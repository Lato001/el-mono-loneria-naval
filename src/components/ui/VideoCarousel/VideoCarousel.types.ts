export interface VideoItem {
  src: string;
  alt: string;
}

export interface VideoCarouselProps {
  videos: VideoItem[];
  className?: string;
}
