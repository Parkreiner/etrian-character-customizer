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
import { useId } from "react";
import { Channel, allChannelInfo } from "./localTypes";

import { Root as VisuallyHidden } from "@radix-ui/react-visually-hidden";
import * as Slider from "@radix-ui/react-slider";
import TooltipTemplate from "@/components/TooltipTemplate";
import useHeldChannelButton from "./useHeldChannelButton";

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
  const { startMouseDown, cancelMouseDown } = useHeldChannelButton(
    value,
    onChannelValueChange
  );

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
        <Slider.Thumb className="block h-5 w-2 rounded-sm bg-teal-50 shadow-[0_2px_10px] shadow-gray-900 hover:bg-teal-200 focus:shadow-[0_0_0_5px] focus:shadow-gray-800 focus:outline-none" />
      </Slider.Root>

      <div className="text-md ml-4 flex w-32 flex-row items-center justify-between gap-x-2 text-center font-medium text-teal-100">
        {/*
         * Buttons are currently copy-pasted twice; didn't feel worth it to
         * split them off into a separate component just yet.
         */}
        <button
          className="rounded-md bg-teal-700 px-2 py-1 text-xs hover:bg-teal-600 hover:text-white"
          onClick={() => onChannelValueChange(value - 1)}
          onMouseDown={() => startMouseDown(-1)}
          onMouseUp={cancelMouseDown}
          onMouseLeave={cancelMouseDown}
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
          onClick={() => onChannelValueChange(value + 1)}
          onMouseDown={() => startMouseDown(1)}
          onMouseUp={cancelMouseDown}
          onMouseLeave={cancelMouseDown}
        >
          <VisuallyHidden>Increment {fullName}</VisuallyHidden>►
        </button>
      </div>
    </div>
  );
}
