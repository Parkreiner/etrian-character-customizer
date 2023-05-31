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

export type Channel = keyof RGBColor | keyof HSVColor;

type ChannelInfo = {
  displayText: string;
  fullName: string;
  max: number;
  unit: "%" | "°" | "";
};

export const allChannelInfo = {
  red: { displayText: "R", fullName: "Red", max: 255, unit: "" },
  green: { displayText: "G", fullName: "Green", max: 255, unit: "" },
  blue: { displayText: "B", fullName: "Blue", max: 255, unit: "" },
  hue: { displayText: "H", fullName: "Hue", max: 359, unit: "°" },
  sat: { displayText: "S", fullName: "Saturation", max: 100, unit: "%" },
  val: { displayText: "V", fullName: "Value/Brightness", max: 100, unit: "%" },
} as const satisfies Record<Channel, ChannelInfo>;
