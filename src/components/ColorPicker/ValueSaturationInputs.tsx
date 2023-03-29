import { ComponentPropsWithoutRef, useId } from "react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import * as Slider from "@radix-ui/react-slider";
import * as Tooltip from "@radix-ui/react-tooltip";
import { HSVColor } from "./localTypes";

type ChannelWithoutHue = Exclude<keyof HSVColor, "hue">;
type TextInfo = {
  type: ChannelWithoutHue;
  displayText: string;
  labelText: string;
};

const inputInfo = [
  { type: "sat", displayText: "S", labelText: "Saturation" },
  { type: "val", displayText: "V", labelText: "Value/Brightness" },
] as const satisfies readonly TextInfo[];

type Props = {
  hsv: HSVColor;
  onChannelChange: (channel: ChannelWithoutHue, newValue: number) => void;
};

export default function SaturationValueInputs({ hsv, onChannelChange }: Props) {
  const hookId = useId();

  return (
    <section className="flex w-full flex-col justify-center">
      {inputInfo.map(({ type, displayText, labelText }) => {
        const numberInputId = `${hookId}-${labelText}-number`;
        const inputValue = hsv[type];

        const sharedInputProps = {
          min: 0,
          max: 100,
          step: 1,
        } as const satisfies ComponentPropsWithoutRef<"input">;

        return (
          <div
            key={labelText}
            className="flex w-full p-1 align-bottom first:mb-1"
          >
            <Tooltip.Root>
              <Tooltip.Content>
                <p className="rounded-md bg-black py-2 px-4 text-white">
                  {labelText}
                </p>
                <Tooltip.Arrow className="fill-black" />
              </Tooltip.Content>
              <Tooltip.Trigger className="cursor-default">
                <label
                  htmlFor={numberInputId}
                  className="mr-4 block basis-6 font-bold text-teal-50"
                >
                  <VisuallyHidden.Root>Number input for </VisuallyHidden.Root>
                  {displayText}
                  <VisuallyHidden.Root> ({labelText})</VisuallyHidden.Root>
                </label>
              </Tooltip.Trigger>
            </Tooltip.Root>

            <Slider.Root
              {...sharedInputProps}
              className="relative flex grow touch-none select-none items-center"
              value={[inputValue]}
              onValueChange={(newSliderValues) => {
                onChannelChange(type, newSliderValues[0] as number);
              }}
              aria-label={`Slider for ${labelText}`}
            >
              <Slider.Track className="relative h-[4px] grow rounded-full bg-teal-900">
                <Slider.Range className="absolute h-full rounded-full bg-teal-100" />
              </Slider.Track>
              <Slider.Thumb className="block h-5 w-5 rounded-[10px] bg-white shadow-[0_2px_10px] shadow-gray-900 hover:bg-teal-100 focus:shadow-[0_0_0_5px] focus:shadow-gray-800 focus:outline-none" />
            </Slider.Root>

            <input
              {...sharedInputProps}
              className="ml-4 basis-6 text-center"
              id={numberInputId}
              type="number"
              value={inputValue}
              onChange={(e) => onChannelChange(type, e.target.valueAsNumber)}
            />
          </div>
        );
      })}
    </section>
  );
}
