import { useCallback, useId } from "react";
import useSliderPosition from "./useSliderPosition";
import useSliderInputs from "./useSliderInputs";

type Props = {
  hue: number;
  onHueChange: (newHue: number) => void;
};

/**
 * 2023-04-29 - Ran into a glitch with React itself, based around useRef. For
 * some reason, after the callback ref ran, all refs in this component started
 * to get really screwy when you accessed their values. The div with
 * containerRef would spit out errors about both ref and key not being valid
 * props that you can access. There aren't any keys in this component, though,
 * and the refs obviously exist. The thing also is, the div for the container
 * ref isn't really accessed anywhere.
 *
 * The access glitch was so bad that even just logging the current values (not\
 * doing anything else with them) caused errors in the console.
 *
 * Need to see if I can replicate this.
 */
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
