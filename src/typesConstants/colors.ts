/**
 * @file Defines all types and constants for working with colors in the client
 * app.
 */

/** A color in the RGB colorspace */
export type RgbColor = Readonly<{ red: number; green: number; blue: number }>;

/**
 * The color of a character's skin. Values are always fixed and cannot be
 * updated via sliders.
 */
export type SkinColorOption = readonly [color1: RgbColor, color2: RgbColor];

/**
 * Defines all color presets for hair and eyes. Every two colors are of the same
 * shade and are designed to work with each other.
 */
export const COLOR_PRESETS = [
  // Pinks
  { red: 246, green: 141, blue: 180 },
  { red: 167, green: 56, blue: 113 },

  // Reds
  { red: 202, green: 57, blue: 75 },
  { red: 141, green: 7, blue: 26 },

  // Browns
  { red: 170, green: 101, blue: 96 },
  { red: 110, green: 67, blue: 73 },

  // Oranges
  { red: 250, green: 180, blue: 123 },
  { red: 199, green: 98, blue: 69 },

  // Yellows
  { red: 252, green: 232, blue: 126 },
  { red: 227, green: 137, blue: 80 },

  // Greens
  { red: 73, green: 182, blue: 121 },
  { red: 45, green: 91, blue: 68 },

  // Blues
  { red: 104, green: 161, blue: 231 },
  { red: 52, green: 110, blue: 169 },

  // Plums
  { red: 105, green: 109, blue: 177 },
  { red: 55, green: 58, blue: 101 },

  // Magentas
  { red: 164, green: 79, blue: 164 },
  { red: 99, green: 38, blue: 98 },

  // Lavenders
  { red: 216, green: 172, blue: 254 },
  { red: 113, green: 86, blue: 151 },

  // Whites
  { red: 239, green: 229, blue: 227 },
  { red: 170, green: 140, blue: 151 },

  // Blacks
  { red: 78, green: 67, blue: 85 },
  { red: 43, green: 27, blue: 34 },
] as const satisfies readonly RgbColor[];

/**
 * All skin colors. Color pairs get darker as you go through the array.
 */
export const SKIN_COLOR_PRESETS = [
  [
    { red: 255, green: 241, blue: 215 },
    { red: 187, green: 157, blue: 190 },
  ],
  [
    { red: 247, green: 233, blue: 221 },
    { red: 185, green: 150, blue: 145 },
  ],
  [
    { red: 255, green: 233, blue: 207 },
    { red: 221, green: 148, blue: 146 },
  ],
  [
    { red: 254, green: 222, blue: 175 },
    { red: 219, green: 139, blue: 120 },
  ],
  [
    { red: 253, green: 207, blue: 155 },
    { red: 194, green: 112, blue: 96 },
  ],
  [
    { red: 253, green: 187, blue: 127 },
    { red: 149, green: 103, blue: 103 },
  ],
  [
    { red: 244, green: 171, blue: 127 },
    { red: 156, green: 92, blue: 92 },
  ],
  [
    { red: 222, green: 150, blue: 110 },
    { red: 146, green: 73, blue: 57 },
  ],
  [
    { red: 221, green: 142, blue: 111 },
    { red: 119, green: 71, blue: 69 },
  ],
  [
    { red: 170, green: 124, blue: 79 },
    { red: 103, green: 70, blue: 48 },
  ],
  [
    { red: 176, green: 109, blue: 92 },
    { red: 98, green: 61, blue: 62 },
  ],
  [
    { red: 116, green: 85, blue: 77 },
    { red: 62, green: 39, blue: 40 },
  ],
] as const satisfies readonly SkinColorOption[];
