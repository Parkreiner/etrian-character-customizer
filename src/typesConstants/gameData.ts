import { CharacterColors, ColorCategory } from "./colors";

export const gameOrigins = ["eo1", "eo2", "eo3"] as const;
export type GameOrigin = (typeof gameOrigins)[number];

export type CanvasPathEntry = Readonly<{
  path: string;
  layerIndex: number;
  category: ColorCategory;
  categoryIndex: number;
}>;

export type Character = {
  id: string;
  displayId: string;
  game: GameOrigin;
  class: string;
  imgUrl: string;
  paths: readonly CanvasPathEntry[];

  initialColors: CharacterColors;
  totalColors: number;

  xStart: number;
  xEnd: number;
  yStart: number;
  yEnd: number;
};

/**
 * Organizes all classes for the editor by the order they're listed in-game.
 */
export type ClassOrderings = Record<GameOrigin, readonly string[]>;
