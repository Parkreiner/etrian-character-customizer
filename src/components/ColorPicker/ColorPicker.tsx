import SaturationBrightnessInputs from "./SatBrightnessInputs";
import { HSBColor, RGBColor } from "./localTypes";
import { hexToRgb, rgbToHsb, hsbToHex, rgbToHex } from "./colorHelpers";
import RgbInputs from "./RgbInputs";
import HueWheel from "./HueWheel";

type Props = {
  hexColor: string;
  onColorChange: (newHexColor: string) => void;
};

export default function ColorPicker({ hexColor, onColorChange }: Props) {
  const rgb = hexToRgb(hexColor);
  const hsb = rgbToHsb(rgb);

  const onRgbChannelChange = (channel: keyof RGBColor, newValue: number) => {
    const inputInvalid =
      !Number.isInteger(newValue) || newValue < 0 || newValue > 255;

    if (inputInvalid) return;
    const newHex = rgbToHex({ ...rgb, [channel]: newValue });
    onColorChange(newHex);
  };

  const onHsbChannelChange = (channel: keyof HSBColor, newValue: number) => {
    const inputInvalid =
      !Number.isInteger(newValue) ||
      newValue < 0 ||
      (channel === "hue" && newValue > 360) ||
      ((channel === "bri" || channel === "sat") && newValue > 100);

    if (inputInvalid) return;
    const newHex = hsbToHex({ ...hsb, [channel]: newValue });
    onColorChange(newHex);
  };

  return (
    <section>
      <HueWheel
        hue={hsb.hue}
        onHueChange={(newValue) => onHsbChannelChange("hue", newValue)}
      />

      <SaturationBrightnessInputs
        hsb={hsb}
        onChannelChange={onHsbChannelChange}
      />

      <RgbInputs rgb={rgb} onChannelChange={onRgbChannelChange} />
    </section>
  );
}
