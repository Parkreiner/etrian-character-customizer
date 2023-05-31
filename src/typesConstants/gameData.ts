import { CharacterColors, ColorCategory } from "./colors";

export const gameOrigins = ["eo1", "eo2", "eo3"] as const;
export type GameOrigin = (typeof gameOrigins)[number];

export type CharacterGroup = Map<string, readonly Character[]>;
export type CharsGroupedByGame = Map<GameOrigin, CharacterGroup>;

export type SvgEntry = Readonly<{
  pathData: string;
  layerIndex: number;
  category: ColorCategory;
  categoryIndex: number;
}>;

export type Character = {
  id: string;
  game: GameOrigin;
  class: string;
  imgUrl: string;
  svgs: readonly SvgEntry[];

  colors: CharacterColors;
  totalColors: number;
};

/**
 * Organizes all classes for the editor by the order they're listed in-game.
 */
export type ClassOrderings = Record<GameOrigin, readonly string[]>;
