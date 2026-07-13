import { useEffect, useRef, useState } from "react";

interface UseFadeInOnViewOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export function useFadeInOnView<T extends HTMLElement>(
  opts: UseFadeInOnViewOptions = {},
) {
  const { threshold = 0.1, rootMargin = "0px 0px -10% 0px", once = true } = opts;
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, visible };
}
