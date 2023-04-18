import { ColorTuple, CharacterColors } from "./colors";

export const gameOrigins = ["eo1", "eo2", "eo3"] as const;
export type GameOrigin = (typeof gameOrigins)[number];

export type CharacterGroup = Map<string, Character[]>;
export type CharsGroupedByGame = Map<GameOrigin, CharacterGroup>;

export type SvgTuple = [svg1: string, svg2: string];

export type CharacterSvgs = {
  [key in keyof CharacterColors]: CharacterColors[key] extends ColorTuple
    ? SvgTuple
    : string[];
};

export type Character = {
  id: string;
  game: GameOrigin;
  class: string;
  imgUrl: string;
  svgs: CharacterSvgs;
  colors: CharacterColors;
};

/**
 * Organizes all classes for the editor by the order they're listed in-game.
 */
export type ClassOrderings = Record<GameOrigin, string[]>;
