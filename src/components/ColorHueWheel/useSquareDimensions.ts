/**
 * @file Custom hook that exposes a ref that, when attached to an element, will
 * ensure that the height of an element always matches its width.
 */
import { useState, useRef, useLayoutEffect } from "react";

export default function useSquareDimensions<Element extends HTMLElement>() {
  const [elementWidth, setElementWidth] = useState<number | null>(null);
  const elementRef = useRef<Element>(null);

  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new ResizeObserver((observedEntries) => {
      const elementWidth = observedEntries[0]?.borderBoxSize[0]?.inlineSize;
      if (elementWidth === undefined) return;
      setElementWidth(elementWidth);
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const container = elementRef.current;
    if (container && elementWidth !== null) {
      container.style.height = `${elementWidth}px`;
    }
  }, [elementWidth]);

  return {
    /**
     * Attach this ref to an element to make sure it's always a square.
     */
    ref: elementRef,

    /**
     * The size of the square element, made available for render logic. Will be
     * null on mount.
     */
    size: elementWidth,
  } as const;
}
