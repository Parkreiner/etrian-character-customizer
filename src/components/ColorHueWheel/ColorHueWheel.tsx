import { useId } from "react";

import { wrapHue } from "./localHelpers";
import useSlider from "./useSlider";

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
 * ref isn't really accessed anywhere, yet that was where all the complaints
 * were coming from (presumably because it was the first ref attached?).
 *
 * The access glitch was so bad that even just logging the current values (not
 * doing anything else with them) caused errors in the console.
 *
 * Need to see if I can replicate this.
 */
export default function ColorHueWheel({ hue, onHueChange }: Props) {
  const instanceId = useId();
  const { containerRef, sliderRef } = useSlider(hue, onHueChange);
  const textId = `${instanceId}-text`;

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
      />
    </div>
  );
}
