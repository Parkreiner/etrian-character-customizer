import { useLayoutEffect, useRef } from "react";

export default function useModalBackground() {
  const contentRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const content = contentRef.current;
    if (content === null) return;

    const syncBackgroundWithContent: ResizeObserverCallback = (entries) => {
      const content = contentRef.current;
      const background = backgroundRef.current;
      if (content === null || background === null) return;

      const sizeInfo = entries[0]?.borderBoxSize[0];
      if (sizeInfo === undefined) return;

      const containerWidth = sizeInfo.inlineSize;
      const viewportWidth = window.innerWidth;
      const height = window.innerHeight;

      const heightSq = height ** 2;
      const bgWidth = Math.round(Math.sqrt(containerWidth ** 2 + heightSq));
      const bgHeight = Math.round(Math.sqrt(viewportWidth ** 2 + heightSq));

      // Need to figure out actual formula
      const bgRotation = -35;

      background.style.width = `${bgWidth}px`;
      background.style.height = `${bgHeight}px`;
      background.style.transform = `rotate(${bgRotation}deg)`;
    };

    const observer = new ResizeObserver(syncBackgroundWithContent);
    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  return { contentRef, backgroundRef } as const;
}
