import * as Tooltip from "@radix-ui/react-tooltip";
import { RgbColor } from "@/typesConstants/colors";
import { toRgba } from "@/helpers/colors";
import { clsx } from "clsx";

type Props = {
  primaryColor: RgbColor;
  secondaryColor?: RgbColor;
  selected: boolean;
  labelText: string;
  onClick: () => void;
};

export default function ColorBubble({
  primaryColor,
  secondaryColor,
  selected,
  labelText,
  onClick,
}: Props) {
  return (
    <Tooltip.Root defaultOpen={false}>
      <Tooltip.Content className="rounded-md bg-black py-2 px-4 text-white">
        <p>{labelText}</p>
        <Tooltip.Arrow />
      </Tooltip.Content>

      <Tooltip.Trigger asChild>
        <button onClick={onClick}>
          <div
            className={clsx(
              "rounded-full bg-teal-700 p-[4px]",
              selected && "bg-gradient-to-br from-orange-400 to-yellow-300"
            )}
          >
            <div
              className="relative h-16 w-16 overflow-hidden rounded-full"
              style={{ backgroundColor: toRgba(primaryColor) }}
            >
              {secondaryColor !== undefined && (
                <div
                  className="absolute right-[-1.4rem] bottom-0 h-8 w-24 rotate-[-45deg]"
                  style={{ backgroundColor: toRgba(secondaryColor) }}
                ></div>
              )}
            </div>
          </div>
        </button>
      </Tooltip.Trigger>
    </Tooltip.Root>
  );
}
