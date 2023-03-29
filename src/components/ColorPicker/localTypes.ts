/** A tuple of the strings "red", "green", and "blue", in that order. */
export const rgbChannels = [
  "red",
  "green",
  "blue",
] as const satisfies readonly (keyof RGBColor)[];

/** A color in the RGB (Red, Green, Blue) colorspace. */
export type RGBColor = Readonly<{ red: number; green: number; blue: number }>;

/** A color in the HSV (Hue, Saturation, Value/Brightness) colorspace. */
export type HSVColor = Readonly<{ hue: number; sat: number; val: number }>;
