import { Character } from "@/typesConstants/gameData";
import { ApiResponse } from "./useAppState";

export async function mockFetchCharacters(url: string) {
  console.log(`Provided URL: ${url}`);

  const baseCharacter: Omit<Character, "id"> = {
    game: "eo1",
    class: "protector",
    imgUrl: "http://jank.com",

    colors: {
      skin: ["#f4dac5", "#cb988f"],
      hair: ["#da7c48", "#814246"],
      leftEye: ["#b17850", "#87494a"],
      rightEye: ["#b17850", "#87494a"],
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
        "war magus",
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
