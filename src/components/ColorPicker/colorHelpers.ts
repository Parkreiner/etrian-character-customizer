/**
 * @file A lot of color conversion functions. Most of the app does not need to
 * be aware of these conversions; they should just use the hex colors directly.
 *
 * All HSB calculations translated directly from the HSL/HSV Wikipedia article.
 * Note: HSB and HSV are the same thing.
 * {@link https://en.wikipedia.org/wiki/HSL_and_HSV}
 */
import { RGBColor, HSBColor } from "./localTypes";

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

export function rgbToHsb(rgb: RGBColor): HSBColor {
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
  } else if (brightness === adjustedRed) {
    hue = 60 * (((adjustedGreen - adjustedBlue) / chroma) % 6);
  } else if (brightness === adjustedGreen) {
    hue = 60 * ((adjustedBlue - adjustedRed) / chroma + 2);
  } else {
    hue = 60 * ((adjustedRed - adjustedGreen) / chroma + 4);
  }

  return {
    hue: Math.round(hue),
    sat: Math.round(saturation * 100),
    bri: Math.round(brightness * 100),
  };
}

export function rgbToHex(color: RGBColor): string {
  const { red, green, blue } = color;

  const hexRed = red.toString(16).padStart(2, "0");
  const hexGreen = green.toString(16).padStart(2, "0");
  const hexBlue = blue.toString(16).padStart(2, "0");

  return `#${hexRed}${hexGreen}${hexBlue}`;
}

export function hsbToRgb(color: HSBColor): RGBColor {
  const { hue, sat, bri } = color;

  const adjustedSat = sat / 100;
  const adjustedBri = bri / 100;
  const chroma = adjustedSat * adjustedBri;

  const clampedHue = hue / 60;
  const xFactor = chroma * (1 - Math.abs((clampedHue % 2) - 1));
  const mOffset = adjustedBri - chroma;

  let redRatio: number;
  let greenRatio: number;
  let blueRatio: number;

  // For all branches, one channel gets chroma, one gets xFactor, one gets 0
  if (clampedHue >= 5) {
    redRatio = chroma;
    greenRatio = 0;
    blueRatio = xFactor;
  } else if (clampedHue >= 4) {
    redRatio = xFactor;
    greenRatio = 0;
    blueRatio = chroma;
  } else if (clampedHue >= 3) {
    redRatio = 0;
    greenRatio = xFactor;
    blueRatio = chroma;
  } else if (clampedHue >= 2) {
    redRatio = 0;
    greenRatio = chroma;
    blueRatio = xFactor;
  } else if (clampedHue >= 1) {
    redRatio = xFactor;
    greenRatio = chroma;
    blueRatio = 0;
  } else {
    redRatio = chroma;
    greenRatio = xFactor;
    blueRatio = 0;
  }

  return {
    red: Math.round(255 * (redRatio + mOffset)),
    green: Math.round(255 * (greenRatio + mOffset)),
    blue: Math.round(255 * (blueRatio + mOffset)),
  } as const;
}

export function hsbToHex(color: HSBColor): string {
  // Got lazy and didn't want to implement more math
  return rgbToHex(hsbToRgb(color));
}
