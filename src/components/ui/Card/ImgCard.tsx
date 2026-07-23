import { useState, useEffect } from "react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

interface ImgCardProps {
  src?: string;
  alt?: string;
  images?: { src: string; alt: string }[];
  interval?: number;
  className?: string;
  title?: string;
  imageClassName?: string;
  showControls?: boolean;
}

export function ImgCard({
  src,
  alt,
  images,
  interval = 4000,
  className = "",
  title,
  imageClassName = "",
  showControls = false,
}: ImgCardProps) {
  const hasSlideshow = images && images.length > 1;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!hasSlideshow || isHovered) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [hasSlideshow, images, interval, isHovered]);

  const goToPrev = () => {
    if (!images || images.length === 0) return;
    setCurrentIndex((i) => (i - 1 + images.length) % images.length);
  };
  const goToNext = () => {
    if (!images || images.length === 0) return;
    setCurrentIndex((i) => (i + 1) % images.length);
  };

  if (hasSlideshow) {
    return (
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          w-full max-w-md aspect-3/4 relative
          rounded-3xl 
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
        {showControls && (
          <>
            <button
              type="button"
              onClick={goToPrev}
              aria-label="Imagen anterior"
              className="absolute left-3 top-1/2 z-20 -translate-y-1/2 cursor-pointer rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pr-aquamarine"
            >
              <IconChevronLeft className="h-5 w-5" stroke={2} />
            </button>
            <button
              type="button"
              onClick={goToNext}
              aria-label="Siguiente imagen"
              className="absolute right-3 top-1/2 z-20 -translate-y-1/2 cursor-pointer rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pr-aquamarine"
            >
              <IconChevronRight className="h-5 w-5" stroke={2} />
            </button>
          </>
        )}
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
