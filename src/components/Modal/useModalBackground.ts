import { useLayoutEffect, useRef } from "react";

export default function useModalBackground() {
  const contentRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const syncBackgroundWithContent = () => {
      const content = contentRef.current;
      const background = backgroundRef.current;
      if (content === null || background === null) return;

      const containerWidth = content.offsetWidth;
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

    // Can't observe content element itself, because it'll stop triggering the
    // observer callback if you keep resizing the window after the content has
    // hits its max width. At the same time, can't read the observed values
    // through the callback parameters, or else you'll have data on the body,
    // not the content
    const observer = new ResizeObserver(syncBackgroundWithContent);
    observer.observe(document.body, { box: "border-box" });
    return () => observer.disconnect();
  }, []);

  return { contentRef, backgroundRef } as const;
}
