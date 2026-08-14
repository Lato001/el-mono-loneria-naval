export interface VideoItem {
  /** Primary source — WebM (VP9) when the browser supports it. */
  src: string;
  /** Fallback source — MP4 (H.264), used when WebM is unsupported. */
  srcFallback: string;
  /** Optimized poster (WebP) shown until the video loads. */
  poster: string;
  alt: string;
}

export interface VideoCarouselProps {
  videos: VideoItem[];
  className?: string;
}
