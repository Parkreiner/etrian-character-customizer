import { rgbChannels, RGBColor } from "./localTypes";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import TooltipTemplate from "@/components/TooltipTemplate";

type Props = {
  rgb: RGBColor;
  onChannelChange: (channel: keyof RGBColor, value: number) => void;
};

export default function RgbInputs({ rgb, onChannelChange }: Props) {
  return (
    <section className="mt-4 flex w-full flex-row flex-wrap justify-center gap-x-4">
      {rgbChannels.map((channel) => {
        const firstLetter = channel.slice(0, 1).toUpperCase();
        const formattedChannel = firstLetter + channel.slice(1);

        return (
          <label key={channel} className="rounded-md bg-teal-900 p-1">
            <TooltipTemplate labelText={formattedChannel}>
              <span className="pl-2 font-bold text-teal-50">
                {firstLetter}
                <VisuallyHidden.Root>({formattedChannel})</VisuallyHidden.Root>
              </span>
            </TooltipTemplate>

            <input
              className="ml-3 flex-grow rounded-tr-sm rounded-br-sm bg-teal-50 pl-4 text-center"
              type="number"
              value={rgb[channel]}
              min="0"
              max="255"
              step="1"
              onChange={(e) => {
                onChannelChange(channel, e.target.valueAsNumber);
              }}
            />
          </label>
        );
      })}
    </section>
  );
}
