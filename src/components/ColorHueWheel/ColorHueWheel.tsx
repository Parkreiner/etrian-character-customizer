import { useId, useLayoutEffect, useRef } from "react";
import useSquareDimensions from "./useSquareDimensions";

type Props = {
  hue: number;
  onHueChange: (newHue: number) => void;
};

export default function ColorHueWheel({ hue, onHueChange }: Props) {
  const { size, ref: containerRef } = useSquareDimensions<HTMLDivElement>();
  const sliderRef = useRef<HTMLButtonElement>(null);
  const instanceId = useId();

  useLayoutEffect(() => {
    const slider = sliderRef.current;
    if (!slider || size === null) return;

    const degrees = (hue + 90) % 360;
    const radians = (Math.PI * degrees) / 180;

    const radius = size / 2;
    const yVector = radius * Math.sin(radians);
    const xVector = radius * Math.cos(radians);

    const topOffset = radius - yVector;
    const leftOffset = radius + xVector;

    slider.style.top = `${topOffset}px`;
    slider.style.left = `${leftOffset}px`;
  }, [hue, size]);

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
