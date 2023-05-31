/**
 * @file Custom hook that exposes a ref that, when attached to an element, will
 * ensure that the height of an element always matches its width.
 */
import { useState, useRef, useLayoutEffect } from "react";

export default function useSquareDimensions<Element extends HTMLElement>() {
  const [elementSize, setElementSize] = useState<number | null>(null);
  const elementRef = useRef<Element | null>(null);

  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new ResizeObserver((observedEntries) => {
      // Normally, localized writing direction would make this logic like this
      // break (vertical letters would make inlineSize be vertical, and
      // borderBoxSize be horizontal), but because we're dealing with squares,
      // it should still work
      const elementWidth = observedEntries[0]?.borderBoxSize[0]?.inlineSize;
      if (elementWidth === undefined) return;
      setElementSize(elementWidth);

      // Have to mutate the height here instead of other effects (especially any
      // that run based on React state) to avoid any UI screen flickering.
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
