import * as Tooltip from "@radix-ui/react-tooltip";
import { SkinColorOption } from "../../typesConstants/colors";
import { toRgbString } from "../../helpers/colors";

type Props = {
  color: SkinColorOption;
  selected: boolean;
  labelText: string;
  onClick: () => void;
};

export default function ColorBubble({
  color,
  selected,
  labelText,
  onClick,
}: Props) {
  const [color1, color2] = color;

  return (
    <Tooltip.Root defaultOpen={false}>
      <Tooltip.Content className="rounded-sm bg-black py-2 px-4 text-white">
        <p>{labelText}</p>
        <Tooltip.Arrow />
      </Tooltip.Content>

      <Tooltip.Trigger asChild>
        <button onClick={onClick}>
          <div>
            <div
              className={`relative h-16 w-16 overflow-hidden rounded-full border-4 ${
                selected ? "border-yellow-400" : "border-teal-800"
              }`}
              style={{ backgroundColor: toRgbString(color1) }}
            >
              <div
                className="absolute right-[-1.95rem] bottom-0 h-8 w-24 rotate-[-45deg]"
                style={{ backgroundColor: toRgbString(color2) }}
              ></div>
            </div>
          </div>
        </button>
      </Tooltip.Trigger>
    </Tooltip.Root>
  );
}
