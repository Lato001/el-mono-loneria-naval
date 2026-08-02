import ReactPlayer from "react-player";

interface MediaPlayerProps {
  src: string;
  className?: string;
}

function MediaPlayer({ src, className }: MediaPlayerProps) {
  return (
    <div className={`w-full h-full aspect-video ${className ?? ""}`}>
      <ReactPlayer loop muted autoPlay width="100%" height="100%" src={src} />
    </div>
  );
}

export default MediaPlayer;
