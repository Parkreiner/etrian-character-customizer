import { Character, ClassOrderings } from "@/typesConstants/gameData";
import { ApiResponse } from "@/hooks/useGameInfoFetch";
import { CharacterColors } from "@/typesConstants/colors";

const baseCharacter: Omit<Character, "id" | "initialColors"> = {
  game: "eo1",
  class: "protector",
  imgUrl: "https://i.imgur.com/2eiuAIn.png",

  paths: [
    {
      category: "skin",
      categoryIndex: 0,
      layerIndex: 0,
      path: "M20 20 h 50 v 50 h -50 Z",
    },
    {
      category: "skin",
      categoryIndex: 1,
      layerIndex: 0,
      path: "M20 80 h 50 v 50 h -50 Z",
    },
    {
      category: "hair",
      categoryIndex: 0,
      layerIndex: 0,
      path: "M20 140 h 50 v 50 h -50 Z",
    },
    {
      category: "hair",
      categoryIndex: 1,
      layerIndex: 0,
      path: "M20 200 h 50 v 50 h -50 Z",
    },
    {
      category: "leftEye",
      categoryIndex: 0,
      layerIndex: 0,
      path: "M20 260 h 50 v 50 h -50 Z",
    },
    {
      category: "leftEye",
      categoryIndex: 1,
      layerIndex: 0,
      path: "M20 320 h 50 v 50 h -50 Z",
    },
    {
      category: "rightEye",
      categoryIndex: 0,
      layerIndex: 0,
      path: "M20 380 h 50 v 50 h -50 Z",
    },
    {
      category: "rightEye",
      categoryIndex: 1,
      layerIndex: 0,
      path: "M20 440 h 50 v 50 h -50 Z",
    },
  ],
  totalColors: 8,
};

const colorsForProtectors: readonly CharacterColors[] = [
  {
    skin: ["#f4dac5", "#cb988f"],
    hair: ["#da7c48", "#814246"],
    leftEye: ["#b17850", "#87494a"],
    rightEye: ["#b17850", "#87494a"],
    misc: [],
  },
  {
    skin: ["#fcf0d7", "#c08c7c"],
    hair: ["#f8d79a", "#f8d79a"],
    leftEye: ["#b4b0e3", "#4e4eaa"],
    rightEye: ["#b4b0e3", "#4e4eaa"],
    misc: [],
  },
  {
    skin: ["#fffde4", "#cf9280"],
    hair: ["#fae4a3", "#dd6f56"],
    leftEye: ["#b5b6ee", "#5a57bd"],
    rightEye: ["#b5b6ee", "#5a57bd"],
    misc: [],
  },
  {
    skin: ["#fffde2", "#cb917f"],
    hair: ["#f1a172", "#b5534e"],
    leftEye: ["#edcdab", "#a88b64"],
    rightEye: ["#edcdab", "#a88b64"],
    misc: [],
  },
  {
    skin: ["#d3a697", "#77524b"],
    hair: ["#f19a96", "#a95f57"],
    leftEye: ["#bbc5b2", "#676b59"],
    rightEye: ["#bbc5b2", "#676b59"],
    misc: [],
  },
];

const classOrderings: ClassOrderings = {
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
};

export async function mockFetchCharacters(url: string) {
  console.log(`Provided URL: ${url}`);

  const res: ApiResponse = {
    classOrderings,
    characters: [1, 2, 3, 4, 5].map((num) => {
      return {
        ...baseCharacter,
        id: String(num),
        initialColors: colorsForProtectors[num - 1] as CharacterColors,
      };
    }),
  };

  return new Promise<ApiResponse>((resolve) => {
    window.setTimeout(() => {
      resolve(res);
    }, 400);
  });
}
