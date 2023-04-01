import { Character } from "@/typesConstants/gameData";
import { ApiResponse } from "./useAppState";

export async function mockFetchCharacters(url: string) {
  const baseCharacter: Omit<Character, "id"> = {
    game: "eo1",
    class: "protector",
    imgUrl: "http://jank.com",

    colors: {
      leftEye: ["#ff0000", "#ff0000"],
      rightEye: ["#ff0000", "#ff0000"],
      hair: ["#ff0000", "#ff0000"],
      skin: ["#ff0000", "#ff0000"],
      misc: [],
    },

    svgs: {
      leftEye: ["", ""],
      rightEye: ["", ""],
      hair: ["", ""],
      skin: ["", ""],
      misc: [],
    },
  };

  const res: ApiResponse = {
    characters: [1, 2, 3, 4, 5].map((num) => {
      return { ...baseCharacter, id: String(num) };
    }),

    classOrderings: {
      eo1: [
        "landsknecht",
        "survivalist",
        "protector",
        "dark hunter",
        "medic",
        "alchemist",
        "troubadour",
        "ronin",
        "hexer",
      ],

      eo2: [
        "landsknecht",
        "survivalist",
        "protector",
        "dark hunter",
        "medic",
        "alchemist",
        "troubadour",
        "ronin",
        "hexer",
        "gunner",
        "beast",
      ],

      eo3: [
        "sovereign",
        "gladiator",
        "hoplite",
        "buccaneer",
        "ninja",
        "monk",
        "zodiac",
        "wildling",
        "arbalist",
        "farmer",
        "shogun",
        "yggdroid",
      ],
    },
  };

  return new Promise<ApiResponse>((resolve) => {
    window.setTimeout(() => {
      resolve(res);
    }, 400);
  });
}
