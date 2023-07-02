import { useId } from "react";
import { Channel, allChannelInfo } from "./localTypes";

import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import * as Slider from "@radix-ui/react-slider";
import TooltipTemplate from "@/components/TooltipTemplate";
import useHeldInputHandlers from "./useHeldInputHandlers";

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
  const hookId = useId();
  const handlers = useHeldInputHandlers(value, onChannelValueChange);

  const { displayText, fullName, max, unit } = allChannelInfo[channel];
  const sliderLabelId = `${hookId}-${channel}`;

  return (
    <div className="flex w-full p-1 align-bottom first:mb-1">
      <TooltipTemplate labelText={fullName}>
        {/*
         * Wanted to use <label>, but it causes an a11y violation, because Radix
         * doesn't use any <input> elements internally.
         */}
        <div
          id={sliderLabelId}
          className="mr-3 block w-2 basis-6 text-center font-bold text-teal-50"
        >
          <VisuallyHidden.Root>
            Slider input for {fullName} (
          </VisuallyHidden.Root>

          {displayText}

          <VisuallyHidden.Root>)</VisuallyHidden.Root>
        </div>
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
      >
        <Slider.Track className="relative h-[4px] grow rounded-full bg-black">
          <Slider.Range className="absolute h-full rounded-full bg-teal-200" />
        </Slider.Track>
        <Slider.Thumb
          aria-labelledby={sliderLabelId}
          className="block h-5 w-2 rounded-sm bg-teal-50 shadow-[0_2px_10px] shadow-gray-900 hover:bg-teal-200 focus:shadow-[0_0_0_5px] focus:shadow-gray-800 focus:outline-none"
        />
      </Slider.Root>

      <div className="text-md ml-4 flex w-32 flex-row items-center justify-between gap-x-2 text-center font-medium text-teal-100">
        {/*
         * Buttons are currently copy-pasted twice; didn't feel worth it to
         * split them off into a separate component just yet.
         */}
        <button
          className="rounded-md bg-teal-700 px-2 py-1 text-xs hover:bg-teal-600 hover:text-white"
          onKeyDown={(e) => handlers.onKeyDown(e, -1)}
          onKeyUp={handlers.onKeyUp}
          onMouseDown={() => handlers.onMouseDown(-1)}
          onMouseUp={handlers.onMouseUp}
          onMouseLeave={handlers.onMouseLeave}
        >
          <VisuallyHidden.Root>Decrement {fullName} </VisuallyHidden.Root>◄
        </button>

        <p className="h-fit w-16 text-teal-50">
          <VisuallyHidden.Root>{fullName} is at</VisuallyHidden.Root>
          {value}
          {unit}
        </p>

        <button
          className="rounded-md bg-teal-700 px-2 py-1 text-xs hover:bg-teal-600 hover:text-white"
          onKeyDown={(e) => handlers.onKeyDown(e, 1)}
          onKeyUp={handlers.onKeyUp}
          onMouseDown={() => handlers.onMouseDown(1)}
          onMouseUp={handlers.onMouseUp}
          onMouseLeave={handlers.onMouseLeave}
        >
          <VisuallyHidden.Root>Increment {fullName} </VisuallyHidden.Root>►
        </button>
      </div>
    </div>
  );
}
