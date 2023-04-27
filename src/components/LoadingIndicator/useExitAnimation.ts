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

const finalFramePosition = "translateY(-100vh)";

const initialStyles = {
  transition: `all ${exitAnimationDurationMs}ms ease-in-out`,
  transform: "translateY(0)",
} as const satisfies React.CSSProperties;

export default function useExitAnimation(
  appLoaded: boolean,
  onAnimationCompletion: () => void
) {
  // Can't treat styles as a derived value, because the state should only be
  // able to transition one-way (from bottom: 0 to bottom: 100%). Could move the
  // state sync outside the effect and have it run inline, but LoadingIndicator
  // should always be small; rendering twice should have limited consequences.
  const [styles, setStyles] = useState<React.CSSProperties>(initialStyles);
  const completionCallbackRef = useRef(onAnimationCompletion);

  // This effect must always be called before the timeout effect
  useEffect(() => {
    completionCallbackRef.current = onAnimationCompletion;
  }, [onAnimationCompletion]);

  useEffect(() => {
    if (!appLoaded) return;

    setStyles((currentStyles) => {
      if (currentStyles.transform === finalFramePosition) return currentStyles;
      return { ...currentStyles, transform: finalFramePosition };
    });

    const callRef = () => completionCallbackRef.current();
    const timeoutId = window.setTimeout(callRef, exitAnimationDurationMs);
    return () => window.clearTimeout(timeoutId);
  }, [appLoaded]);

  return styles;
}
