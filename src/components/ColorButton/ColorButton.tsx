/**
 * @file Defines a clickable "bubble" button for selecting a specific color in
 * the UI.
 *
 * @todo Figure out how to fix the secondary colors not fully covering all of
 * their half of their bubbles. There's usually a few pixels of the primary
 * color visible still, even when everything should be covered.
 */
import TooltipTemplate from "@/components/TooltipTemplate";
import * as Tooltip from "@radix-ui/react-tooltip";
import { clsx } from "clsx";
import { useId } from "react";

type Props = {
  primaryHex: string;
  labelText: string;
  onClick: () => void;

  secondaryHex?: string;
  selected?: boolean;
  default?: boolean;
};

/**
 * @todo Finish this implementation.
 */
function DefaultTextLabel() {
  const hookId = useId();
  const circleId = `${hookId}-circle`;

  return (
    <svg
      className="absolute z-10"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle id={circleId} cx="50" cy="50" r="50" fill="none" />
      <text width="500">
        <textPath color="white" alignment-baseline="top" href={circleId}>
          Default
        </textPath>
      </text>
    </svg>
  );
}

export default function ColorBubble({
  primaryHex,
  onClick,
  labelText,

  secondaryHex,
  selected = false,
  default: isDefault = false,
}: Props) {
  return (
    <TooltipTemplate labelText={labelText}>
      <button className="relative" onClick={onClick}>
        {isDefault && <DefaultTextLabel />}

        <div
          className={clsx(
            "rounded-full bg-teal-700 p-[4px]",
            selected && "bg-gradient-to-br from-orange-400 to-yellow-300"
          )}
        >
          <div
            className="relative h-14 w-14 overflow-hidden rounded-full"
            style={{ backgroundColor: primaryHex }}
          >
            {secondaryHex !== undefined && (
              <div
                className="absolute right-[-1.9rem] bottom-0 h-8 w-24 rotate-[-45deg]"
                style={{ backgroundColor: secondaryHex }}
              />
            )}
          </div>
        </div>
      </button>
    </TooltipTemplate>
  );
}
