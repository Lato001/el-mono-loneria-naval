import ReactPlayer from "react-player";

interface MediaPlayerProps {
  src: string;
}

function MediaPlayer({ src }: MediaPlayerProps) {
  return (
    <ReactPlayer
      style={{ width: "700px", height: "300px", aspectRatio: "16/9" }}
      src={`${src}`}
    />
  );
}

export default MediaPlayer;
