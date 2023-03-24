/**
 * @file A component that lets you pick colors via RGB or HSB. Chose to use HSB
 * instead of HSL because it's more intuitive to someone who's used a lot of
 * Adobe products.
 *
 * @todo Fix and validate all the color conversion helper functions (RGB and hex
 *       should be fine; the HSB conversions are the big concern)
 * @todo Implement the useStableHsb hook for a better user experience
 * @todo Figure out why the Radix sliders aren't appearing in the
 *       SatBrightnessInput component (the sliders might be there; they might
 *       just need a ton of CSS?)
 * @todo Figure out how to implement the HueWheel component and make sure that
 *       the movements are locked to a circle
 */
import { useState, useRef } from "react";
import SaturationBrightnessInputs from "./SatBrightnessInputs";
import { HSBColor, RGBColor } from "./localTypes";
import { hexToRgb, rgbToHsb, hsbToHex, rgbToHex } from "./colorHelpers";
import RgbInputs from "./RgbInputs";
import HueWheel from "./HueWheel";

type Props = {
  hexColor: string;
  onColorChange: (newHexColor: string) => void;
};

/**
 * Lot of things to consider/test out/research for this hook.
 *
 * @todo Fix the base rgbToHsb function so that the hue shift from 299 to 300
 *       doesn't break things. It should go 299 to 300, not 299 to -60
 * @todo Implement the hook so that going from a saturation of 1 to 0 doesn't
 *       affect the hue. The hue should go to 0 in traditional HSB calculations,
 *       but it's not the best user experience.
 * @todo Figure out the best way to prevent one HSB channel from jumping around
 *       as the result of another HSB channel changing (rounding issues?)
 * @todo Research whether it makes sense to turn this into a useStableColors
 *       hook that
 */
function useStableHsb(rgb: RGBColor): HSBColor {
  return rgbToHsb(rgb);
}

function ColorPicker({ hexColor, onColorChange }: Props) {
  const rgb = hexToRgb(hexColor);
  const hsb = useStableHsb(rgb);

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

export default function ColorPickerTester() {
  const [hex, setHex] = useState("#ffff00");

  return (
    <div
      style={{
        width: "500px",
        height: "500px",
        backgroundColor: hex,
      }}
    >
      <ColorPicker hexColor={hex} onColorChange={(newHex) => setHex(newHex)} />
    </div>
  );
}
