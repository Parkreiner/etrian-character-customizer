import { useLayoutEffect, useRef } from "react";

const RADIANS_TO_DEGREES = 180 / Math.PI;

export default function useModalBackground() {
  const contentRef = useRef<HTMLDivElement>(null);
  const topBgRef = useRef<HTMLDivElement>(null);
  const bottomBgRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const syncBackgroundWithContent = () => {
      const content = contentRef.current;
      const topBg = topBgRef.current;
      const bottomBg = bottomBgRef.current;

      if (content === null || topBg === null || bottomBg === null) {
        return;
      }

      const containerWidth = content.offsetWidth;
      const viewportWidth = window.innerWidth;
      const height = window.innerHeight;

      const heightSq = height ** 2;
      const bgWidth = Math.round(Math.sqrt(containerWidth ** 2 + heightSq));
      const bgHeight = Math.round(Math.sqrt(viewportWidth ** 2 + heightSq));

      const offset = RADIANS_TO_DEGREES * Math.atan(viewportWidth / height);
      const bg1Rotation = -90 + offset;
      const bg2Rotation = Math.max(-90, bg1Rotation - 7);

      topBg.style.width = `${bgWidth}px`;
      topBg.style.height = `${bgHeight}px`;
      topBg.style.transform = `rotate(${bg1Rotation}deg)`;

      bottomBg.style.width = `${bgWidth}px`;
      bottomBg.style.height = `${bgHeight}px`;
      bottomBg.style.transform = `rotate(${bg2Rotation}deg)`;
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

  return { contentRef, topBgRef, bottomBgRef } as const;
}
