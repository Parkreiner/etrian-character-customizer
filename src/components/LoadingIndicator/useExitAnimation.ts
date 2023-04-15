import { useState, useEffect } from "react";
import { exitAnimationDurationMs } from "./localConstants";

const initialStyles = {
  transition: `all ${exitAnimationDurationMs}ms`,
  bottom: "0",
} as const satisfies React.CSSProperties;

export default function useExitAnimation(
  appLoaded: boolean,
  onAnimationCompletion: () => void
) {
  const [styles, setStyles] = useState<React.CSSProperties>(initialStyles);

  useEffect(() => {
    if (!appLoaded) return;
    setStyles((current) => ({ ...current, bottom: "100%" }));

    const animationCompletionId = window.setTimeout(
      onAnimationCompletion,
      exitAnimationDurationMs
    );

    return () => window.clearTimeout(animationCompletionId);
  }, [appLoaded]);

  return styles;
}
