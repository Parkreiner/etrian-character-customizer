/**
 * > What am I trying to do?
 * I'm trying to make my buttons feel really nice, by letting you either click
 * them once to increment/decrement by a single step, or hold them down, to
 * keep doing that operation over a period of time, until you let go of the
 * mouse.
 *
 * What should happen when you press a button?
 * 1. A state update should happen immediately.
 * 2.
 */
import { useEffect, useId, useRef } from "react";
import { HSVColor, RGBColor } from "./localTypes";

import { Root as VisuallyHidden } from "@radix-ui/react-visually-hidden";
import * as Slider from "@radix-ui/react-slider";
import TooltipTemplate from "@/components/TooltipTemplate";

type Channel = keyof RGBColor | keyof HSVColor;

type ChannelInfo = {
  displayText: string;
  fullName: string;
  max: number;
  unit: "%" | "°" | "";
};

const allChannelInfo = {
  red: { displayText: "R", fullName: "Red", max: 255, unit: "" },
  green: { displayText: "G", fullName: "Green", max: 255, unit: "" },
  blue: { displayText: "B", fullName: "Blue", max: 255, unit: "" },
  hue: { displayText: "H", fullName: "Hue", max: 359, unit: "°" },
  sat: { displayText: "S", fullName: "Saturation", max: 100, unit: "%" },
  val: { displayText: "V", fullName: "Value/Brightness", max: 100, unit: "%" },
} as const satisfies Record<Channel, ChannelInfo>;

type SliderProps = {
  channel: Channel;
  value: number;
  onChannelValueChange: (newValue: number) => void;
};

export default function ColorSlider({
  channel,
  value,
  onChannelValueChange,
}: SliderProps) {
  const instanceId = useId();
  const mouseHoldIdRef = useRef(0);
  const channelCallbackRef = useRef(onChannelValueChange);

  useEffect(() => {
    channelCallbackRef.current = onChannelValueChange;
  }, [onChannelValueChange]);

  const onMouseClick = (valueOffset: -1 | 1) => {
    let localValue = value + valueOffset;
    channelCallbackRef.current(localValue);

    mouseHoldIdRef.current = window.setTimeout(() => {
      mouseHoldIdRef.current = window.setInterval(() => {
        localValue += valueOffset;
        channelCallbackRef.current(localValue);
      }, 100);
    }, 600);
  };

  const clearMouseHoldId = () => {
    if (mouseHoldIdRef.current !== 0) {
      window.clearTimeout(mouseHoldIdRef.current);
      window.clearInterval(mouseHoldIdRef.current);
      mouseHoldIdRef.current = 0;
    }
  };

  const { displayText, fullName, max, unit } = allChannelInfo[channel];
  const numberInputId = `${instanceId}-${channel}`;

  return (
    <div className="flex w-full p-1 align-bottom first:mb-1">
      <TooltipTemplate labelText={fullName}>
        <label
          htmlFor={numberInputId}
          className="mr-3 block w-2 basis-6 text-center font-bold text-teal-50"
        >
          <VisuallyHidden>Number input for {fullName} (</VisuallyHidden>
          {displayText}
          <VisuallyHidden>)</VisuallyHidden>
        </label>
      </TooltipTemplate>

      <Slider.Root
        className="relative flex grow touch-none select-none items-center"
        value={[value]}
        min={0}
        max={max}
        step={1}
        onValueChange={(newSliderValues) => {
          onChannelValueChange(newSliderValues[0] as number);
        }}
        aria-label={`Slider for ${fullName}`}
      >
        <Slider.Track className="relative h-[4px] grow rounded-full bg-black">
          <Slider.Range className="absolute h-full rounded-full bg-teal-200" />
        </Slider.Track>
        <Slider.Thumb className="block h-5 w-2 rounded-sm bg-white shadow-[0_2px_10px] shadow-gray-900 hover:bg-teal-100 focus:shadow-[0_0_0_5px] focus:shadow-gray-800 focus:outline-none" />
      </Slider.Root>

      <div className="text-md ml-4 flex w-32 flex-row items-center justify-between gap-x-2 text-center font-medium text-teal-100">
        {/*
         * Buttons are currently copy-pasted twice; didn't feel worth it to
         * split them off into a separate component just yet.
         */}
        <button
          className="rounded-md bg-teal-700 px-2 py-1 text-xs hover:bg-teal-600 hover:text-white"
          onMouseDown={() => onMouseClick(-1)}
          onMouseUp={clearMouseHoldId}
          onMouseLeave={clearMouseHoldId}
        >
          <VisuallyHidden>Decrement {fullName}</VisuallyHidden>◄
        </button>

        <p className="h-fit w-16 text-teal-50">
          <VisuallyHidden>{fullName} is at</VisuallyHidden>
          {value}
          {unit}
        </p>

        <button
          className="rounded-md bg-teal-700 px-2 py-1 text-xs hover:bg-teal-600 hover:text-white"
          onMouseDown={() => onMouseClick(1)}
          onMouseUp={clearMouseHoldId}
          onMouseLeave={clearMouseHoldId}
        >
          <VisuallyHidden>Increment {fullName}</VisuallyHidden>►
        </button>
      </div>
    </div>
  );
}
