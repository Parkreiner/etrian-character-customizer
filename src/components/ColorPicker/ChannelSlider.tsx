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
import { useId, useRef } from "react";
import { HSVColor, RGBColor } from "./localTypes";

import { Root as VisuallyHidden } from "@radix-ui/react-visually-hidden";
import * as Slider from "@radix-ui/react-slider";
import TooltipTemplate from "@/components/TooltipTemplate";

type Channel = keyof RGBColor | keyof HSVColor;

type ChannelInfo = {
  displayText: string;
  labelText: string;
  max: number;
  unit: "%" | "°" | "";
};

const allChannelInfo = {
  red: { displayText: "R", labelText: "Red", max: 255, unit: "" },
  green: { displayText: "G", labelText: "Green", max: 255, unit: "" },
  blue: { displayText: "B", labelText: "Blue", max: 255, unit: "" },
  hue: { displayText: "H", labelText: "Hue", max: 359, unit: "°" },
  sat: { displayText: "S", labelText: "Saturation", max: 100, unit: "%" },
  val: { displayText: "V", labelText: "Value/Brightness", max: 100, unit: "%" },
} as const satisfies Record<Channel, ChannelInfo>;

type Props = {
  channel: Channel;
  value: number;
  onChannelValueChange: (newValue: number) => void;
};

export default function ColorSlider({
  channel,
  value,
  onChannelValueChange,
}: Props) {
  const instanceId = useId();

  const timeoutIdRef = useRef(0);
  const intervalIdRef = useRef(0);
  const tickRef = useRef<(() => void) | null>(null);

  const { displayText, labelText, max, unit } = allChannelInfo[channel];
  const numberInputId = `${instanceId}-${channel}`;

  const setupMouseHoldLogic = () => {
    if (timeoutIdRef.current !== 0 || intervalIdRef.current !== 0) return;

    timeoutIdRef.current = window.setTimeout(() => {
      timeoutIdRef.current = 0;
      intervalIdRef.current = window.setInterval(() => {
        tickRef.current?.();
      }, 200);
    }, 1000);
  };

  const clearMouseHoldLogic = () => {
    if (timeoutIdRef.current !== 0) {
      window.clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = 0;
    }

    if (intervalIdRef.current !== 0) {
      window.clearInterval(intervalIdRef.current);
      intervalIdRef.current = 0;
    }

    if (tickRef.current !== null) {
      tickRef.current = null;
    }
  };

  const decrement = (value: number) => {
    const newValue = value - 1;
    onChannelValueChange(newValue);

    tickRef.current = () => decrement(newValue);
    setupMouseHoldLogic();
  };

  const increment = (value: number) => {
    const newValue = value + 1;
    onChannelValueChange(newValue);

    tickRef.current = () => increment(newValue);
    setupMouseHoldLogic();
  };

  return (
    <div className="flex w-full p-1 align-bottom first:mb-1">
      <TooltipTemplate labelText={labelText}>
        <label
          htmlFor={numberInputId}
          className="mr-3 block w-2 basis-6 text-center font-bold text-teal-50"
        >
          <VisuallyHidden>Number input for {labelText} (</VisuallyHidden>
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
        aria-label={`Slider for ${labelText}`}
      >
        <Slider.Track className="relative h-[4px] grow rounded-full bg-teal-950">
          <Slider.Range className="absolute h-full rounded-full bg-teal-100" />
        </Slider.Track>
        <Slider.Thumb className="block h-5 w-2 rounded-sm bg-white shadow-[0_2px_10px] shadow-gray-900 hover:bg-teal-100 focus:shadow-[0_0_0_5px] focus:shadow-gray-800 focus:outline-none" />
      </Slider.Root>

      <div className="text-md ml-4 flex w-32 flex-row items-center justify-between gap-x-2 text-center font-medium text-teal-100">
        <button
          className="rounded-md bg-teal-700 px-2 py-1 text-xs hover:bg-teal-600 hover:text-white"
          onMouseDown={() => decrement(value)}
          onMouseUp={clearMouseHoldLogic}
          onMouseLeave={clearMouseHoldLogic}
        >
          <VisuallyHidden>Decrement {displayText}</VisuallyHidden>◄
        </button>

        <p className="h-fit w-16 text-teal-50">
          <VisuallyHidden>{displayText} is at</VisuallyHidden>
          {value}
          {unit}
        </p>

        <button
          className="rounded-md bg-teal-700 px-2 py-1 text-xs hover:bg-teal-600 hover:text-white"
          onMouseDown={() => increment(value)}
          onMouseUp={clearMouseHoldLogic}
          onMouseLeave={clearMouseHoldLogic}
        >
          <VisuallyHidden>Increment {displayText}</VisuallyHidden>►
        </button>
      </div>
    </div>
  );
}
