/**
 * @file A lot of color conversion functions. Most of the app does not need to
 * be aware of these conversions; they should just use the hex colors directly.
 * All HSV calculations translated directly from the HSL/HSV Wikipedia article.
 *
 * Note: HSB and HSV are the same thing, but are different from HSL.
 *
 * {@link https://en.wikipedia.org/wiki/HSL_and_HSV}
 * {@link https://www.quora.com/Is-there-any-way-to-convert-HSV-to-RGB-and-vice-versa-without-data-loss}
 * {@link https://community.adobe.com/t5/illustrator-discussions/how-does-illustrator-s-color-picker-compute-hsb-and-cmyk-values/m-p/11991771}
 */
import { RGBColor, HSVColor } from "./localTypes";

const hexExtractor = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/;

export function hexToRgb(hexColor: string): RGBColor {
  const [, red, green, blue] = hexExtractor.exec(hexColor.toLowerCase()) ?? [];
  if (red === undefined || green === undefined || blue === undefined) {
    throw new Error(`Provided hex value ${hexColor} is invalid`);
  }

  return {
    red: parseInt(red, 16),
    green: parseInt(green, 16),
    blue: parseInt(blue, 16),
  } as const;
}

export function rgbToHsv(rgb: RGBColor): HSVColor {
  const { red, green, blue } = rgb;
  const epsilon = 0.0001;

  const adjustedRed = red / 255;
  const adjustedGreen = green / 255;
  const adjustedBlue = blue / 255;

  const brightness = Math.max(adjustedRed, adjustedGreen, adjustedBlue);
  const minColor = Math.min(adjustedRed, adjustedGreen, adjustedBlue);
  const chroma = brightness - minColor;
  const saturation = brightness < epsilon ? 0 : chroma / brightness;

  let hue: number;
  if (chroma < epsilon) {
    hue = 0;
  } else if (brightness - adjustedRed < epsilon) {
    const hueOffset = 60 * (((adjustedGreen - adjustedBlue) / chroma) % 6);
    hue = hueOffset < 0 ? 360 + hueOffset : hueOffset;
  } else if (brightness - adjustedGreen < epsilon) {
    hue = 60 * ((adjustedBlue - adjustedRed) / chroma + 2);
  } else {
    // Handles brightness matching adjustedBlue; implemented as an else block
    // for type-safety
    hue = 60 * ((adjustedRed - adjustedGreen) / chroma + 4);
  }

  return {
    hue: Math.round(hue),
    sat: Math.round(saturation * 100),
    val: Math.round(brightness * 100),
  };
}

export function rgbToHex(color: RGBColor): string {
  const toClampedHex = (channel: number) => {
    if (Number.isNaN(channel) || !Number.isFinite(channel)) {
      return "00";
    }

    const base = !Number.isInteger(channel) ? Math.trunc(channel) : channel;
    const clamped = Math.min(255, Math.max(0, base));
    return clamped.toString(16).padStart(2, "0");
  };

  const { red, green, blue } = color;
  return `#${toClampedHex(red)}${toClampedHex(green)}${toClampedHex(blue)}`;
}

export function hsvToRgb(color: HSVColor): RGBColor {
  const { hue, sat, val } = color;

  const adjustedSat = sat / 100;
  const adjustedVal = val / 100;
  const chroma = adjustedSat * adjustedVal;

  const clampedHue = hue / 60;
  const xFactor = chroma * (1 - Math.abs((clampedHue % 2) - 1));
  const mOffset = adjustedVal - chroma;

  let r1 = 0;
  let g1 = 0;
  let b1 = 0;

  if (clampedHue >= 5) {
    r1 = chroma;
    b1 = xFactor;
  } else if (clampedHue > 4) {
    r1 = xFactor;
    b1 = chroma;
  } else if (clampedHue > 3) {
    g1 = xFactor;
    b1 = chroma;
  } else if (clampedHue > 2) {
    g1 = chroma;
    b1 = xFactor;
  } else if (clampedHue > 1) {
    r1 = xFactor;
    g1 = chroma;
  } else {
    r1 = chroma;
    g1 = xFactor;
  }

  return {
    red: Math.round(255 * (r1 + mOffset)),
    green: Math.round(255 * (g1 + mOffset)),
    blue: Math.round(255 * (b1 + mOffset)),
  };
}

export function hsvToHex(color: HSVColor): string {
  return rgbToHex(hsvToRgb(color));
}
