import { rgbChannels, RGBColor } from "./localTypes";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

type Props = {
  rgb: RGBColor;
  onChannelChange: (channel: keyof RGBColor, value: number) => void;
};

export default function RgbInputs({ rgb, onChannelChange }: Props) {
  return (
    <section>
      {rgbChannels.map((channel) => (
        <label key={channel}>
          <div>
            {channel.slice(0, 1).toUpperCase()}
            <VisuallyHidden.Root>{channel.slice(1)}</VisuallyHidden.Root>
          </div>

          <input
            type="number"
            value={rgb[channel]}
            min={0}
            max={255}
            onChange={(e) => {
              onChannelChange(channel, e.target.valueAsNumber);
            }}
          />
        </label>
      ))}
    </section>
  );
}
