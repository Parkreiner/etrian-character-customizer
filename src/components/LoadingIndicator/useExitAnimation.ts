/**
 * @file Handles coordinating anything necessary for the LoadingIndicator to
 * perform its exit animation.
 *
 * This hook is doing some funky things to insulate itself from reference
 * changes during re-renders. It's nasty, but it makes the API cleaner when
 * consuming it.
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
  // Splitting up an effect absolutely isn't idiomatic React, but I had to do
  // something to ensure that the timeoutId couldn't be cleaned up as a result
  // of re-renders. It should only be set up once when the app loads, and it
  // should only be cleaned up on unmount.
  const timeoutIdRef = useRef(0);

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

  // Can't treat styles as a derived value, because the state should only be
  // able to transition one-way from bottom: 0 to bottom: 100%. Could move the
  // state sync outside the effect and have it run inline, but LoadingIndicator
  // should always be small; rendering twice should have limited consequences.
  const [styles, setStyles] = useState<React.CSSProperties>(initialStyles);

  useEffect(() => {
    if (!appLoaded || styles.bottom === "100%") return;
    setStyles({ ...styles, bottom: "100%" });
  }, [appLoaded, styles]);

  return styles;
}
