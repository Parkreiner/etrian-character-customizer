import { ComponentPropsWithoutRef, useId } from "react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import * as Slider from "@radix-ui/react-slider";
import { HSBColor } from "./localTypes";

type ChannelWithoutHue = Exclude<keyof HSBColor, "hue">;
type TextInfo = {
  type: ChannelWithoutHue;
  displayText: string;
  labelText: string;
};

const inputInfo = [
  { type: "sat", displayText: "Sat", labelText: "Saturation" },
  { type: "bri", displayText: "Bri", labelText: "Brightness" },
] as const satisfies readonly TextInfo[];

type Props = {
  hsb: HSBColor;
  onChannelChange: (channel: ChannelWithoutHue, newValue: number) => void;
};

export default function SaturationBrightnessInput({
  hsb,
  onChannelChange,
}: Props) {
  const hookId = useId();

  return (
    <section>
      {inputInfo.map(({ type, displayText, labelText }) => {
        const numberInputId = `${hookId}-${labelText}-number`;
        const inputValue = hsb[type];

        const sharedInputProps = {
          min: 0,
          max: 100,
          step: 1,
        } as const satisfies ComponentPropsWithoutRef<"input">;

        return (
          <div key={labelText}>
            <label htmlFor={numberInputId}>
              <VisuallyHidden.Root>Number input for </VisuallyHidden.Root>
              {displayText}{" "}
              <VisuallyHidden.Root>({labelText})</VisuallyHidden.Root>
            </label>

            <label>
              <VisuallyHidden.Root>Slider for {labelText}</VisuallyHidden.Root>

              <Slider.Root
                {...sharedInputProps}
                value={[inputValue]}
                onValueChange={(newSliderValues) => {
                  if (newSliderValues[0] !== undefined) {
                    onChannelChange(type, newSliderValues[0]);
                  }
                }}
              >
                <Slider.Track>
                  <Slider.Range />
                </Slider.Track>
                <Slider.Thumb />
              </Slider.Root>
            </label>

            <input
              {...sharedInputProps}
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
