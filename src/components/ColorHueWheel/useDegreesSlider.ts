import { useLayoutEffect } from "react";
import useSquareDimensions from "./useSquareDimensions";

const RADIAN_CONVERSION_FACTOR = Math.PI / 180;

export default function useDegreesSlider(degrees: number) {
  const { size: containerSize, ref: containerRef } =
    useSquareDimensions<HTMLDivElement>();

  const { size: sliderSize, ref: sliderRef } =
    useSquareDimensions<HTMLButtonElement>();

  useLayoutEffect(() => {
    const slider = sliderRef.current;
    if (!slider || containerSize === null || sliderSize === null) return;

    const radians = degrees * RADIAN_CONVERSION_FACTOR;
    const containerRadius = containerSize / 2;
    const yMagnitude = containerRadius * Math.sin(radians);
    const xMagnitude = containerRadius * Math.cos(radians);

    const sliderRadius = sliderSize / 2;
    const topOffset = containerRadius - yMagnitude - sliderRadius;
    const leftOffset = containerRadius + xMagnitude - sliderRadius;

    slider.style.top = `${topOffset}px`;
    slider.style.left = `${leftOffset}px`;
  }, [degrees, containerSize, sliderSize, sliderRef]);

  return { containerRef, sliderRef } as const;
}
