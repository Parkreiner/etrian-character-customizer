import { Channel, allChannelInfo } from "./localTypes";
import TooltipTemplate from "@/components/TooltipTemplate";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { useId } from "react";
import useHeldInputHandlers from "./useHeldInputHandlers";

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
  const hookId = useId();
  const handlers = useHeldInputHandlers(value, onChannelValueChange);

  const { displayText, fullName, max } = allChannelInfo[channel];
  const numberInputId = `${hookId}-number-input`;

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
          // Max width in place to prevent Firefox-specific styling issues
          className="no-arrow max-w-[50px] grow bg-inherit text-center font-medium"
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
        {arrows.map((symbol) => {
          const valueOffset = symbol === "▲" ? 1 : -1;

          return (
            <button
              className="text-teal-100 opacity-90 first:pb-0.5 hover:text-white hover:opacity-100"
              key={symbol}
              onKeyDown={(e) => handlers.onKeyDown(e, valueOffset)}
              onKeyUp={handlers.onKeyUp}
              onMouseDown={() => handlers.onMouseDown(valueOffset)}
              onMouseUp={handlers.onMouseUp}
              onMouseLeave={handlers.onMouseLeave}
            >
              {symbol}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
