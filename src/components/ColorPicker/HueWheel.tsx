import { useId } from "react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

import { hsvToHex, wrapHue } from "./colorHelpers";
import useSlider from "./useSlider";

type Props = {
  hue: number;
  onHueChange: (newHue: number) => void;
};

export default function ColorHueWheel({ hue, onHueChange }: Props) {
  const hookId = useId();
  const { containerRef, sliderRef } = useSlider(hue, onHueChange);

  const backgroundColor = hsvToHex({ hue, sat: 80, val: 100 });
  const textId = `${hookId}-text`;

  return (
    <div
      ref={containerRef}
      className="relative mx-auto flex w-fit flex-col items-center justify-center rounded-full border-4 border-black p-4 text-yellow-50"
    >
      <label htmlFor={textId} className="mb-1 select-none font-semibold">
        Hue
      </label>

      <div className="flex -translate-y-0.5 align-top leading-none">
        {/* Min/max are a little funky to make hue wrap-arounds easier */}
        <input
          id={textId}
          type="number"
          min="-1"
          max="360"
          step="1"
          value={hue}
          onChange={(e) => onHueChange(wrapHue(e.target.valueAsNumber))}
          // All the extra width properties are meant to help with a Firefox-
          // specific sizing issue when tring to style text inputs
          className="no-arrow block h-16 w-fit min-w-0 max-w-[170px] bg-teal-900 text-right text-[64px] font-bold"
        />
        <span className="h-fit select-none text-[48px] font-medium">°</span>
      </div>

      <button
        role="slider"
        ref={sliderRef}
        className="absolute w-4 rounded-full border-2 border-black focus:outline-none focus:ring-1 focus:ring-teal-200"
        style={{ backgroundColor }}
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
