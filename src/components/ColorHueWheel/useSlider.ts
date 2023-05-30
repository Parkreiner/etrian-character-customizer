import { useEffect, useLayoutEffect, useRef } from "react";

import useSquareDimensions from "./useSquareDimensions";
import { wrapHue } from "./localHelpers";

const DEGREES_TO_RADIANS_FACTOR = Math.PI / 180;

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

export default function useSlider(
  hue: number,
  onHueChange: (newHue: number) => void
) {
  const { size: containerSize, ref: containerRef } =
    useSquareDimensions<HTMLDivElement>();

  const { size: sliderSize, ref: sliderRef } =
    useSquareDimensions<HTMLButtonElement>();

  // Uses hue to determine where the slider is located relative to the container
  useLayoutEffect(() => {
    const slider = sliderRef.current;
    if (!slider || containerSize === null || sliderSize === null) return;

    const radians = hue * DEGREES_TO_RADIANS_FACTOR;
    const containerRadius = containerSize / 2;
    const yMagnitude = containerRadius * Math.sin(radians);
    const xMagnitude = containerRadius * Math.cos(radians);

    const sliderRadius = sliderSize / 2;
    const topOffset = containerRadius - yMagnitude - sliderRadius;
    const leftOffset = containerRadius + xMagnitude - sliderRadius;

    slider.style.top = `${topOffset}px`;
    slider.style.left = `${leftOffset}px`;
  }, [hue, containerSize, sliderSize, sliderRef]);

  // Makes hue and onHueChange reactive so that they don't need to be specified
  // in other dependency arrays. Could split up the effect into two, but it
  // seemed like too much for cheap reassignments
  const hueRef = useRef(hue);
  const onHueChangeRef = useRef(onHueChange);
  useEffect(() => {
    hueRef.current = hue;
    onHueChangeRef.current = onHueChange;
  }, [hue, onHueChange]);

  // Sets up mouse inputs
  useEffect(() => {
    /**
     * Thinking this through:
     * 1. I feel like I have to define everything relative to the container.
     * 2. So when you click on the slider, you don't really listen for anything
     *    else beyond when the user lets go of the mouse. Your focus mainly
     *    shifts to the container.
     * 3. You then basically calculate the angle from the center of the
     *    container to the mouse, and then translate that into the new hue. The
     *    useLayoutEffect already in place will take care of changing the
     *    position of the slider itself.
     */
    const slider = sliderRef.current;
    if (slider === null) return;

    const onClick = (event: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const mouseX = event.pageX;
      const mouseY = event.pageY;

      const containerDimensions = container.getBoundingClientRect();
      const containerCenterX =
        containerDimensions.left +
        Math.round((containerDimensions.right - containerDimensions.left) / 2);
      const containerCenterY =
        containerDimensions.top +
        Math.round((containerDimensions.bottom - containerDimensions.top) / 2);

      // Still figuring this part out - the math isn't right yet
      const xLength = mouseX - containerCenterX;
      const yLength = mouseY - containerCenterY;
      const newHueAngle = Math.atan2(xLength, yLength);

      onHueChangeRef.current(newHueAngle);
    };

    slider.addEventListener("click", onClick);
    return () => slider.removeEventListener("click", onClick);
  }, [containerRef, sliderRef]);

  /**
   * Sets up keyboard inputs
   *
   * @todo Add input acceleration if the user holds a key down for a while, so
   * that they don't have to wait forever for their changes to happen
   */
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

      const difference = targetDegree - hueRef.current;
      const distance1 = Math.abs(difference);
      const distance2 = 360 - distance1;
      const signedBase = difference / distance1;
      const offset = distance1 <= distance2 ? signedBase : -1 * signedBase;

      const newHue = wrapHue(hueRef.current + offset);
      onHueChangeRef.current(newHue);
    };

    slider.addEventListener("keydown", onKeypress);
    return () => slider.removeEventListener("keydown", onKeypress);
  }, [sliderRef]);

  return { containerRef, sliderRef } as const;
}
