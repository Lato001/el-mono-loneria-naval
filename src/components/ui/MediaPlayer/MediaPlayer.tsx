import ReactPlayer from "react-player";
import type { MediaPlayerProps } from "./MediaPlayer.types";

const YOUTUBE_ID_PATTERN =
  /(?:youtube\.com\/(?:watch\?.*v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/;

function getYouTubeId(src: string): string | null {
  return src.match(YOUTUBE_ID_PATTERN)?.[1] ?? null;
}

function MediaPlayer({ src, className }: MediaPlayerProps) {
  const wrapperClassName = `w-full h-full aspect-video ${className ?? ""}`;
  const youtubeId = getYouTubeId(src);

  if (youtubeId) {
    // Direct YouTube iframe: reliable inline playback with native controls on
    // mobile. react-player v3's youtube-video-element fails to start on iOS.
    return (
      <div className={wrapperClassName}>
        <iframe
          className="h-full w-full rounded-2xl"
          src={`https://www.youtube.com/embed/${youtubeId}?playsinline=1&controls=1&rel=0`}
          title="Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className={wrapperClassName}>
      <ReactPlayer
        loop
        controls
        playsInline
        width="100%"
        height="100%"
        src={src}
      />
    </div>
  );
}

export default MediaPlayer;