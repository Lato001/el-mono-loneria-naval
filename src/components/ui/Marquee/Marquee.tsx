import { useState, useRef, useEffect, useCallback } from "react";
import type { MarqueeProps } from "./Marquee.types";
import "./Marquee.css";

export function Marquee({
  items,
  renderItem,
  speed = 20,
  pauseOnHover = true,
  direction = "left",
  className = "",
}: MarqueeProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [multiplier, setMultiplier] = useState(2);

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const measure = () => {
      const contentWidth = content.scrollWidth;
      const containerWidth = container.clientWidth;
      if (contentWidth === 0) return;
      const needed = Math.ceil(containerWidth / contentWidth) + 1;
      setMultiplier(Math.max(2, needed));
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(container);
    observer.observe(content);

    return () => observer.disconnect();
  }, [items]);

  const defaultRender = useCallback(
    (item: MarqueeProps["items"][number]) => (
      <div className="flex shrink-0 items-center gap-2">
        <img
          src={item.src}
          alt={item.alt}
          className="h-12 w-32 object-contain"
        />
        {item.name && <span className="text-sm">{item.name}</span>}
      </div>
    ),
    [],
  );

  const render = renderItem ?? defaultRender;

  return (
    <div
      ref={containerRef}
      className={`w-full overflow-hidden ${pauseOnHover ? "group" : ""} ${className}`}
      onMouseEnter={() => {
        if (pauseOnHover) setIsPaused(true);
      }}
      onMouseLeave={() => {
        if (pauseOnHover) setIsPaused(false);
      }}
    >
      <div
        className="flex"
        style={
          {
            width: "max-content",
            animationName: "marquee-scroll",
            animationDuration: `${speed}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationDirection: direction === "right" ? "reverse" : "normal",
            animationPlayState: isPaused ? "paused" : "running",
            "--marquee-scroll-dist": `-${100 / multiplier}%`,
          } as React.CSSProperties
        }
      >
        <div ref={contentRef} className="flex shrink-0">
          {items.map((item, i) => (
            <div key={item.id} className="shrink-0">
              {render(item, i)}
            </div>
          ))}
        </div>
        {Array.from({ length: multiplier - 1 }).map((_, groupIdx) => (
          <div key={groupIdx} className="flex shrink-0" aria-hidden="true">
            {items.map((item, i) => (
              <div key={`${groupIdx}-${item.id}`} className="shrink-0">
                {render(item, i)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
