/**
 * @file Custom hook that exposes a ref that, when attached to an element, will
 * ensure that the height of an element always matches its width.
 */
import { useState, useRef, useLayoutEffect } from "react";

export default function useSquareDimensions<Element extends HTMLElement>() {
  const [elementSize, setElementSize] = useState<number | null>(null);
  const elementRef = useRef<Element>(null);

  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new ResizeObserver((observedEntries) => {
      // This implementation will not work for websites with vertical letters;
      // inlineSize is based on the localized writing direction
      const elementWidth = observedEntries[0]?.borderBoxSize[0]?.inlineSize;
      if (elementWidth === undefined) return;
      setElementSize(elementWidth);

      // Have to set the height here and not any other effect to avoid screen
      // flickering. Not even useLayoutEffect is fast enough.
      element.style.height = `${elementWidth}px`;
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return {
    /**
     * Attach this ref to an element to make sure it's always a square.
     */
    ref: elementRef,

    /**
     * The size of the square element, made available for render logic. Will be
     * null on mount.
     */
    size: elementSize,
  } as const;
}
