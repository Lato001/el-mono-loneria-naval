import { useState, useEffect } from "react";

interface ImgCardProps {
  src?: string;
  alt?: string;
  images?: { src: string; alt: string }[];
  interval?: number;
  className?: string;
  title?: string;
  imageClassName?: string;
}

export function ImgCard({
  src,
  alt,
  images,
  interval = 4000,
  className = "",
  title,
  imageClassName = "",
}: ImgCardProps) {
  const hasSlideshow = images && images.length > 1;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!hasSlideshow) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [hasSlideshow, images, interval]);

  if (hasSlideshow) {
    return (
      <div
        className={`
          w-full max-w-md aspect-3/4 relative
          rounded-3xl border-2 border-b-sc-sand
          overflow-hidden
          shadow-[0_20px_45px_-10px_rgba(0,0,0,0.55)]
          ${className}
        `}
      >
        {images.map((img, i) => (
          <img
            key={img.src}
            src={img.src}
            alt={img.alt}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              i === currentIndex ? "opacity-100" : "opacity-0 "
            } ${imageClassName}`}
          />
        ))}
        {title && (
          <h2 className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center font-brown tracking-wider text-white text-3xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)]">
            {title}
          </h2>
        )}
      </div>
    );
  }

  return (
    <div
      className={`
         w-full max-w-md aspect-3/4 relative
        rounded-3xl border-2 border-b-sc-sand
        overflow-hidden
        shadow-[0_20px_45px_-10px_rgba(0,0,0,0.55)]
        ${className}
      `}
    >
      <img
        src={src}
        alt={alt}
        className={`h-full w-full object-cover ${imageClassName}`}
        loading="lazy"
      />
      {title && (
        <h2 className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center font-brown uppercase tracking-wider text-white text-3xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)]">
          {title}
        </h2>
      )}
    </div>
  );
}
