import { Character, GameOrigin } from "@/typesConstants/gameData";

/**
 * Organizes all classes for the editor by the ordered they're listed in-game.
 */
export type ClassOrderings = Record<GameOrigin, string[]>;

/**
 * The main API response received by the server.
 */
export type ApiResponse = {
  characters: Character[];
  classOrderings: ClassOrderings;
};
