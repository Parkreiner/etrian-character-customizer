import { useRef, useEffect } from "react";

const cardinalDirections = {
  ArrowRight: 0,
  ArrowUp: 90,
  ArrowLeft: 180,
  ArrowDown: 270,
} as const satisfies Record<string, number>;

function isArrowKey(value: unknown): value is keyof typeof cardinalDirections {
  return (
    typeof value === "string" &&
    (value as keyof typeof cardinalDirections) in cardinalDirections
  );
}

export default function useSliderKeyboardInput<Element extends HTMLElement>(
  hue: number,
  onHueChange: (newHue: number) => void
) {
  const sliderRef = useRef<Element | null>(null);
  const hueRef = useRef(hue);
  const onHueChangeRef = useRef(onHueChange);

  useEffect(() => {
    hueRef.current = hue;
    onHueChangeRef.current = onHueChange;
  }, [hue, onHueChange]);

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider === null) return;

    const onKeypress = (event: KeyboardEvent) => {
      const { key } = event;
      if (slider !== document.activeElement || !isArrowKey(key)) {
        return;
      }

      // Have to do this to prevent other elements from scrolling around; only
      // doing it when the key is definitely an arrow key
      event.preventDefault();

      const targetDegree = cardinalDirections[key];
      if (hueRef.current === targetDegree) {
        return;
      }

      const offset = targetDegree - hueRef.current < 0 ? -1 : 1;
      const newHue = hueRef.current + offset;
      const adjustedHue = newHue < 0 ? 359 : newHue % 360;
      onHueChangeRef.current(adjustedHue);
    };

    slider.addEventListener("keydown", onKeypress);
    return () => slider.removeEventListener("keydown", onKeypress);
  }, []);

  return sliderRef;
}
