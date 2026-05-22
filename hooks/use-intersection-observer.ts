"use client";

import { useEffect, useRef, useState } from "react";

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
) {
  const { threshold = 0, root = null, rootMargin = "0px", freezeOnceVisible = false } = options;
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const nodeRef = useRef<HTMLElement | null>(null);
  const frozen = useRef(false);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node || frozen.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setEntry(entry);
        if (freezeOnceVisible && entry.isIntersecting) {
          frozen.current = true;
          observer.unobserve(node);
        }
      },
      { threshold, root, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, root, rootMargin, freezeOnceVisible]);

  return { nodeRef, entry, isIntersecting: !!entry?.isIntersecting };
}
