export const rgbChannels = [
  "red",
  "green",
  "blue",
] as const satisfies readonly (keyof RGBColor)[];

/** A color in the RGB (Red, Green, Blue) colorspace. */
export type RGBColor = Readonly<{ red: number; green: number; blue: number }>;

/** A color in the HSB (Hue, Saturation, Brightness) colorspace. */
export type HSBColor = Readonly<{ hue: number; sat: number; bri: number }>;
