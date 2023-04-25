/**
 * @file Handles coordinating anything necessary for the LoadingIndicator to
 * perform its exit animation.
 *
 * @todo Eventually planning to beef up the effect logic so that the loading
 * indicator gets covered in SVG vines before it slides up to exit. The effect
 * logic is going to need a whole lot more math to figure out how to place them.
 */
import { useState, useEffect, useRef } from "react";
import { exitAnimationDurationMs } from "./localConstants";

const initialStyles = {
  transition: `all ${exitAnimationDurationMs}ms ease-in-out`,
  bottom: "0",
} as const satisfies React.CSSProperties;

export default function useExitAnimation(
  appLoaded: boolean,
  onAnimationCompletion: () => void
) {
  const [styles, setStyles] = useState<React.CSSProperties>(initialStyles);
  const timeoutIdRef = useRef(0);

  useEffect(() => {
    if (!appLoaded) return;

    setStyles((current) => {
      if (current.bottom === "100%") return current;
      return { ...current, bottom: "100%" };
    });
  }, [appLoaded]);

  useEffect(() => {
    if (!appLoaded || timeoutIdRef.current !== 0) return;

    timeoutIdRef.current = window.setTimeout(
      onAnimationCompletion,
      exitAnimationDurationMs
    );
  }, [appLoaded, onAnimationCompletion]);

  useEffect(() => {
    return () => {
      if (timeoutIdRef.current !== 0) {
        window.clearTimeout(timeoutIdRef.current);
      }
    };
  }, []);

  return styles;
}
