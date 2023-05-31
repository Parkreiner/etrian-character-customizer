import { useEffect, useLayoutEffect, useRef } from "react";

import useSquareDimensions from "./useSquareDimensions";
import { wrapHue } from "./colorHelpers";

const DEGREES_TO_RADIANS_FACTOR = Math.PI / 180;
const RADIANS_TO_DEGREES_FACTOR = 180 / Math.PI;

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
    const slider = sliderRef.current;
    if (slider === null) return;

    let trackingMousePosition = false;

    const startTracking = () => {
      trackingMousePosition = true;
    };

    const endTracking = () => {
      trackingMousePosition = false;
    };

    const onGlobalMouseMove = (event: MouseEvent) => {
      if (!trackingMousePosition || !containerRef.current) return;

      const mouseX = event.pageX;
      const mouseY = event.pageY;

      // Container center values could probably be extracted out in some way,
      // since they won't be changing much
      const containerDimensions = containerRef.current.getBoundingClientRect();
      const containerCenterX = Math.round(
        containerDimensions.left +
          (containerDimensions.right - containerDimensions.left) / 2
      );
      const containerCenterY = Math.round(
        containerDimensions.top +
          (containerDimensions.bottom - containerDimensions.top) / 2
      );

      const xDistance = mouseX - containerCenterX;
      const yDistance = mouseY - containerCenterY;
      const hueOffset =
        Math.atan2(xDistance, yDistance) * RADIANS_TO_DEGREES_FACTOR;

      // For some reason, (360 + hueOffset) was producing a value that was
      // always 90 degrees off. The component works now, but need to figure out
      // what's going on
      const newHueAngle = Math.round((270 + hueOffset) % 360);
      onHueChangeRef.current(newHueAngle);
    };

    slider.addEventListener("mousedown", startTracking);
    window.addEventListener("mouseup", endTracking);
    window.addEventListener("mouseleave", endTracking);
    window.addEventListener("mousemove", onGlobalMouseMove);

    return () => {
      slider.removeEventListener("mousedown", startTracking);
      window.removeEventListener("mouseup", endTracking);
      window.removeEventListener("mouseleave", endTracking);
      window.removeEventListener("mousemove", onGlobalMouseMove);
    };
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

    let keyDownStartTime = 0;

    const onKeyDown = (event: KeyboardEvent) => {
      const { key } = event;
      if (slider !== document.activeElement || !isArrowKey(key)) {
        return;
      }

      // Have to do this to prevent other elements from scrolling around; only
      // doing it when the key is definitely an arrow key
      event.preventDefault();

      if (keyDownStartTime === 0) {
        keyDownStartTime = Date.now();
      }

      const targetDegree = cardinalDirections[key];
      if (hueRef.current === targetDegree) {
        return;
      }

      const degreeDifference = targetDegree - hueRef.current;
      const distance1 = Math.abs(degreeDifference);
      const distance2 = 360 - distance1;
      const signedBase = degreeDifference / distance1;
      const offset = distance1 <= distance2 ? signedBase : -1 * signedBase;

      const timeDifference = Date.now() - keyDownStartTime;

      // Using Math.min for some modifiers to prevent over-shooting the target
      let accelerationModifier = 1;
      if (timeDifference >= 2000) {
        accelerationModifier = Math.min(5, distance1);
      } else if (timeDifference >= 4000) {
        accelerationModifier = Math.min(10, distance1);
      }

      const newHue = wrapHue(hueRef.current + offset * accelerationModifier);
      onHueChangeRef.current(newHue);
    };

    const onKeyUp = () => {
      keyDownStartTime = 0;
    };

    slider.addEventListener("keydown", onKeyDown);
    slider.addEventListener("keyup", onKeyUp);

    return () => {
      slider.removeEventListener("keydown", onKeyDown);
      slider.removeEventListener("keyup", onKeyUp);
    };
  }, [sliderRef]);

  return { containerRef, sliderRef } as const;
}
