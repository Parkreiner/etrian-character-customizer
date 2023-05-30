import { useId } from "react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

import { wrapHue } from "./localHelpers";
import useSlider from "./useSlider";

type Props = {
  hue: number;
  onHueChange: (newHue: number) => void;
};

export default function ColorHueWheel({ hue, onHueChange }: Props) {
  const hookId = useId();
  const { containerRef, sliderRef } = useSlider(hue, onHueChange);
  const textId = `${hookId}-text`;

  return (
    <div
      ref={containerRef}
      className="relative mx-auto flex w-fit flex-col items-center justify-center rounded-full border-4 border-black p-4 text-yellow-50"
    >
      <label htmlFor={textId} className="mb-1 font-semibold">
        Hue
      </label>

      <div className="flex -translate-y-0.5 align-top text-[48px] leading-none">
        {/* Min/max are a little funky to make hue wrap-arounds easier */}
        <input
          id={textId}
          className="no-arrow h-16 bg-teal-900 text-right text-[64px] font-bold"
          type="number"
          min="-1"
          max="360"
          step="1"
          value={hue}
          onChange={(e) => onHueChange(wrapHue(e.target.valueAsNumber))}
        />
        <span className="h-fit font-medium">°</span>
      </div>

      <button
        role="slider"
        ref={sliderRef}
        className="absolute w-4 rounded-full bg-teal-50 hover:bg-teal-100 focus:bg-teal-100 focus:outline-none focus:ring focus:ring-yellow-400"
        tabIndex={0}
        aria-valuenow={hue}
      >
        <VisuallyHidden.Root>
          Click and drag to adjust hue value
        </VisuallyHidden.Root>
      </button>
    </div>
  );
}
