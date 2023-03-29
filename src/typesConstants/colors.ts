/**
 * @file Defines all types and constants for working with colors in the client
 * app.
 */

/**
 * A fixed-length tuple for a character's pair of hair/eye/skin colors.
 */
export type ColorTuple = readonly [hex1: string, hex2: string];

/**
 * Defines all colors for a character.
 *
 * Hair, eyes, and skin are guaranteed to be defined as fixed-length tuples.
 * Characters may have any number of misc. colors (including zero, which will be
 * the most common option for most characters).
 */
export type CharacterColors = {
  hair: ColorTuple;
  eyes: ColorTuple;
  skin: ColorTuple;
  misc: string[];
};

export type ColorCategory = keyof CharacterColors;

/**
 * Defines all color presets for hair and eyes. Every two colors are designed to
 * work with each other.
 */
export const HAIR_EYE_COLOR_PRESETS = [
  // Pinks
  "#F6FFFF",
  "#A73871",

  // Reds
  "#CA394B",
  "#8D071A",

  // Browns
  "#AA6560",
  "#6E4349",

  // Oranges
  "#FAB47B",
  "#C76245",

  // Yellows
  "#FCE87E",
  "#E38950",

  // Greens
  "#49B679",
  "#2D5B44",

  // Blues
  "#68A1E7",
  "#346EA9",

  // Plums
  "#696DB1",
  "#373A65",

  // Magentas
  "#A44FA4",
  "#632662",

  // Lavenders
  "#D8ACFE",
  "#715697",

  // Whites
  "#EFE5E3",
  "#AA8C97",

  // Blacks
  "#4E4355",
  "#2B1B22",
] as const satisfies readonly string[];

/**
 * This is a curated list of all the skin tones from Etrian V. All races had
 * their own skin color palettes, but the full list was trimmed down to avoid
 * overwhelming the user with options.
 *
 * @todo Add colors for the potatoes and dog people, curate the list further,
 * and reorganize the colors so that they feel chromatic.
 */
export const SKIN_COLOR_PRESETS: readonly ColorTuple[] = [
  ["#E9EBF9", "#868EAA"],
  ["#F9F5F2", "#B1B2A1"],
  ["#F7E9DD", "#B99691"],
  ["#FFF1D7", "#BB9DBE"],
  ["#BB9DBE", "#DD9492"],
  ["#FFEED6", "#CE8B9D"],
  ["#FEDEAF", "#DB8B78"],
  ["#FDCF9B", "#C27060"],
  ["#FDBB7F", "#956767"],
  ["#F4AB7F", "#9C5C5C"],
  ["#DE966E", "#924939"],
  ["#DD8E6F", "#774745"],
  ["#AA7C4F", "#674630"],
  ["#B06D5C", "#623D3E"],
  ["#74554D", "#3E2728"],
  ["#8D7A7A", "#493B3D"],
  ["#FFE4C7", "#C9808F"],
  ["#F6CFA1", "#C2817F"],
  ["#F8E4C7", "#C9808F"],
  ["#BCBAA2", "#6F677C"],
  ["#B9D8D8", "#6F7FB2"],
  ["#88B36B", "#46685E"],
  ["#A686B1", "#5B4559"],
];
