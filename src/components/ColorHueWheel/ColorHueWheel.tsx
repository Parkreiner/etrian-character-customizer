import { useId, useLayoutEffect } from "react";
import useSquareDimensions from "./useSquareDimensions";

type Props = {
  hue: number;
  onHueChange: (newHue: number) => void;
};

export default function ColorHueWheel({ hue, onHueChange }: Props) {
  const instanceId = useId();
  const { size: containerSize, ref: containerRef } =
    useSquareDimensions<HTMLDivElement>();

  const { size: sliderSize, ref: sliderRef } =
    useSquareDimensions<HTMLButtonElement>();

  useLayoutEffect(() => {
    const slider = sliderRef.current;
    if (!slider || containerSize === null || sliderSize === null) return;

    const radians = (Math.PI * hue) / 180;
    const containerRadius = containerSize / 2;
    const yMagnitude = containerRadius * Math.sin(radians);
    const xMagnitude = containerRadius * Math.cos(radians);

    const sliderRadius = sliderSize / 2;
    const topOffset = containerRadius - yMagnitude - sliderRadius;
    const leftOffset = containerRadius + xMagnitude - sliderRadius;

    slider.style.top = `${topOffset}px`;
    slider.style.left = `${leftOffset}px`;
  }, [hue, containerSize, sliderSize, sliderRef]);

  const textId = `${instanceId}-text`;

  return (
    <div
      ref={containerRef}
      className="relative mx-auto flex w-fit flex-col items-center justify-center rounded-full border-2 border-black p-4 text-yellow-50"
    >
      <label htmlFor={textId} className="mb-1 font-semibold">
        Hue
      </label>

      <div className="flex align-top leading-none">
        {/* Min/max are a little funky to make hue wrap-arounds easier */}
        <input
          id={textId}
          className="no-arrow h-16 bg-teal-900 text-right text-[72px] font-bold hover:ring-red-500"
          type="number"
          min="-1"
          max="360"
          step="1"
          value={hue}
          onChange={(e) => {
            const eventHue = e.target.valueAsNumber;
            const adjustedHue = eventHue < 0 ? 359 : eventHue % 360;
            onHueChange(adjustedHue);
          }}
        />
        <span className="h-fit text-[72px]">°</span>
      </div>

      <button
        ref={sliderRef}
        className="absolute top-0 h-4 w-4 rounded-full bg-yellow-400"
      />
    </div>
  );
}
