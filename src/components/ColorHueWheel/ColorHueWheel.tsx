import { useCallback, useId } from "react";
import useSliderPosition from "./useSliderPosition";
import useSliderInputs from "./useSliderInputs";

type Props = {
  hue: number;
  onHueChange: (newHue: number) => void;
};

export default function ColorHueWheel({ hue, onHueChange }: Props) {
  const instanceId = useId();
  const { containerRef, sliderRef } = useSliderPosition(hue);
  const sliderRef2 = useSliderInputs(hue, onHueChange);

  const updateSliderRefs = useCallback(
    (node: HTMLButtonElement | null) => {
      sliderRef.current = node;
      sliderRef2.current = node;
    },
    [sliderRef, sliderRef2]
  );

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
        ref={updateSliderRefs}
        className="absolute w-4 rounded-full bg-yellow-400"
      />
    </div>
  );
}
