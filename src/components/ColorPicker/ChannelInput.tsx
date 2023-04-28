import { Channel, allChannelInfo } from "./localTypes";
import TooltipTemplate from "@/components/TooltipTemplate";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

type Props = {
  channel: Channel;
  value: number;
  onChannelValueChange: (newValue: number) => void;
};

export default function ChannelInput({
  channel,
  value,
  onChannelValueChange,
}: Props) {
  const { displayText, fullName, max } = allChannelInfo[channel];

  return (
    <label key={channel} className="rounded-md bg-teal-950 p-1">
      <TooltipTemplate labelText={fullName}>
        <span className="pl-2 font-bold text-teal-50">
          {displayText}
          <VisuallyHidden.Root> ({fullName})</VisuallyHidden.Root>
        </span>
      </TooltipTemplate>

      <input
        className="ml-3 flex-grow rounded-br-sm rounded-tr-sm bg-teal-50 pl-4 text-center"
        type="number"
        value={value}
        min="0"
        max={max}
        step="1"
        onChange={(e) => onChannelValueChange(e.target.valueAsNumber)}
      />
    </label>
  );
}
