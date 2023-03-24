import { RGBColor, HSBColor } from "./localTypes";

const hexExtractor = /^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/;

export function hexToRgb(hexColor: string): RGBColor {
  const [, red, green, blue] = hexExtractor.exec(hexColor.toLowerCase()) ?? [];
  return {
    red: parseInt(red ?? "0", 16),
    green: parseInt(green ?? "0", 16),
    blue: parseInt(blue ?? "0", 16),
  } as const;
}

export function rgbToHsb(rgb: RGBColor): HSBColor {
  const { red, green, blue } = rgb;

  const min = Math.min(red, green, blue);
  const max = Math.max(red, green, blue);
  const middle = red + green + blue - (max + min);

  return {
    hue: Math.floor(((middle - min) / max) * 360),
    sat: Math.floor(((max - min) / max) * 100),
    bri: Math.floor((max / 255) * 100),
  } as const;
}

export function rgbToHex(color: RGBColor): string {
  const red = color.red.toString(16);
  const green = color.green.toString(16);
  const blue = color.blue.toString(16);
  return `#${red}${green}${blue}`;
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
