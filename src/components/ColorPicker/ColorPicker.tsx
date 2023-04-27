/**
 * @file A component that lets you pick colors via RGB or HSV.
 *
 * Chose to use HSV instead of HSL because it's more intuitive to someone who's
 * used a lot of Adobe products (even though only HSL is supported by CSS).
 *
 * The rest of the app is using hex codes to make working with colors easier.
 * This is the only top-level component that needs to be aware of the RGB and
 * HSV formats. However, RGB->HSV and HSV->RGB are both lossy formulas, and the
 * numbers can sometimes do weird things, which, when you have controlled inputs
 * bound to the numbers, can make them also do weird things. The HSV values had
 * to be separated into state to keep the UI feeling nice and not janky.
 *
 * Notable UI jank caused by the formulas:
 * - Anytime saturation goes to 0, hue is also supposed to be 0. But having hue
 *   change because you were changing a different channel felt weird. Hue would
 *   also be forever stuck at 0 in the UI until you added saturation back.
 * - Because HSV->RGB/Hex is lossy, there would be cases (especially for the
 *   brighter colors) where you would change something in the HSV inputs, which
 *   would make a new HSV object. The HSV would then be converted to hex, and
 *   the hex would be passed to onHexChange. But the new hex string would be the
 *   same as the old hex string, and so nothing would re-render. The only way to
 *   get the UI unstuck was by changing a V value or an RGB value.
 *
 * @todo Figure out how to implement the HueWheel component and make sure that
 * the movements are locked to a circle (this will probably be hard)
 */
import { useState } from "react";
import { HSVColor, RGBColor } from "./localTypes";
import { hexToRgb, rgbToHsv, hsvToHex, rgbToHex } from "./colorHelpers";
import { clamp } from "@/utils/math";

import RgbInputs from "./RgbInputs";
import HueWheel from "./HueWheel";
import ChannelSlider from "./ChannelSlider";

type Props = {
  hexColor: string;
  onHexChange: (newHexColor: string) => void;
};

export default function ColorPicker({ hexColor, onHexChange }: Props) {
  const rgb = hexToRgb(hexColor);
  const [hsv, setHsv] = useState(() => rgbToHsv(rgb));
  const [cachedHex, setCachedHex] = useState(hexColor);

  const onRgbChannelChange = (channel: keyof RGBColor, newValue: number) => {
    const clamped = clamp(newValue, 0, 255);
    if (!Number.isInteger(clamped) || rgb[channel] === clamped) {
      return;
    }

    const newRgb = { ...rgb, [channel]: clamped };
    const newHex = rgbToHex(newRgb);

    setHsv(rgbToHsv(newRgb));
    setCachedHex(newHex);
    onHexChange(newHex);
  };

  const onHsvChannelChange = (channel: keyof HSVColor, newValue: number) => {
    const maxValue = channel === "hue" ? 359 : 100;
    const clamped = clamp(newValue, 0, maxValue);

    if (!Number.isInteger(clamped) || hsv[channel] === clamped) {
      return;
    }

    const newHsv = { ...hsv, [channel]: clamped };
    const newHex = hsvToHex(newHsv);

    setHsv(newHsv);
    setCachedHex(newHex);
    onHexChange(newHex);
  };

  // Ugly state sync – necessary evil to avoid UI lockups
  const needStateSync = hexColor !== cachedHex;
  if (needStateSync) {
    const freshHsv = rgbToHsv(rgb);
    setHsv(freshHsv);
    setCachedHex(hexColor);
  }

  return (
    <fieldset className="w-full">
      <HueWheel
        hue={hsv.hue}
        onHueChange={(newValue) => onHsvChannelChange("hue", newValue)}
      />

      <section className="flex w-full flex-col justify-center">
        <ChannelSlider
          channel="sat"
          value={hsv.sat}
          onChannelValueChange={(newValue) =>
            onHsvChannelChange("sat", newValue)
          }
        />

        <ChannelSlider
          channel="val"
          value={hsv.val}
          onChannelValueChange={(newValue) =>
            onHsvChannelChange("val", newValue)
          }
        />
      </section>

      <RgbInputs rgb={rgb} onChannelChange={onRgbChannelChange} />
    </fieldset>
  );
}
