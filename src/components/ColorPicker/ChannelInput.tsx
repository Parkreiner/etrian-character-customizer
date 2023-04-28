import { Channel, allChannelInfo } from "./localTypes";
import TooltipTemplate from "@/components/TooltipTemplate";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { useId } from "react";

type Props = {
  channel: Channel;
  value: number;
  onChannelValueChange: (newValue: number) => void;
};

const arrows = ["▲", "▼"] as const;

export default function ChannelInput({
  channel,
  value,
  onChannelValueChange,
}: Props) {
  const instanceId = useId();
  const numberInputId = `${instanceId}-number-input`;
  const { displayText, fullName, max } = allChannelInfo[channel];

  return (
    <fieldset className="flex grow items-center rounded-lg border-2 border-teal-700 text-teal-50">
      <VisuallyHidden.Root>
        <legend>Inputs for {fullName}</legend>
      </VisuallyHidden.Root>

      <label
        htmlFor={numberInputId}
        className="bg-teal-700 px-2 py-1 text-sm font-bold"
      >
        <TooltipTemplate labelText={fullName}>
          <span>
            {displayText}
            <VisuallyHidden.Root> ({fullName})</VisuallyHidden.Root>
          </span>
        </TooltipTemplate>
      </label>

      <div className="flex grow flex-row flex-nowrap items-center justify-center px-1">
        <input
          className="no-arrow grow bg-inherit text-center font-medium"
          type="number"
          id={numberInputId}
          value={value}
          min="0"
          max={max}
          step="1"
          onChange={(e) => onChannelValueChange(e.target.valueAsNumber)}
        />
      </div>

      <div className="flex h-full flex-col flex-nowrap bg-teal-700 p-1 pl-1.5 pr-[5px] text-[9px] leading-none">
        {arrows.map((symbol) => (
          <button
            className="first:pb-0.5 hover:text-white"
            key={symbol}
            onClick={() => {
              const offset = symbol === "▲" ? 1 : -1;
              onChannelValueChange(value + offset);
            }}
          >
            {symbol}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
