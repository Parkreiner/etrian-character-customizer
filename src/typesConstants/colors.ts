export type RgbColor = Readonly<{ red: number; green: number; blue: number }>;
export type SkinColorOption = readonly [color1: RgbColor, color2: RgbColor];

// Colors get darker as you go down - just defined as runtime constant because
// these values will never change
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
