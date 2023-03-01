type RgbColor = { red: number; green: number; blue: number };
export type ColorOption = readonly [color1: RgbColor, color2: RgbColor];

// Colors get darker as you go down
export const presetHairColors = [
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
] as const satisfies readonly ColorOption[];
