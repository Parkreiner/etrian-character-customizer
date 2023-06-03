import { Character, ClassOrderings } from "@/typesConstants/gameData";
import { ApiResponse } from "@/hooks/useGameInfoFetch";

const sharedPathInfo: Character["paths"] = [
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
];

const characters: readonly Omit<Character, "id">[] = [
  {
    game: "eo1",
    class: "protector",
    displayId: "1",
    imgUrl: "https://i.imgur.com/gUP2q9Z.png",
    paths: sharedPathInfo,
    totalColors: 8,

    xStart: 95,
    xEnd: 953,
    yStart: 195,
    yEnd: 1188,

    initialColors: {
      skin: ["#fcf0d7", "#c08c7c"],
      hair: ["#f8d79a", "#f8d79a"],
      leftEye: ["#b4b0e3", "#4e4eaa"],
      rightEye: ["#b4b0e3", "#4e4eaa"],
      misc: [],
    },
  },
  {
    game: "eo1",
    class: "protector",
    displayId: "2",
    imgUrl: "https://i.imgur.com/kFRBqKf.png",
    paths: sharedPathInfo,
    totalColors: 8,

    xStart: 88,
    xEnd: 892,
    yStart: 182,
    yEnd: 1183,

    initialColors: {
      skin: ["#fffde4", "#cf9280"],
      hair: ["#fae4a3", "#dd6f56"],
      leftEye: ["#b5b6ee", "#5a57bd"],
      rightEye: ["#b5b6ee", "#5a57bd"],
      misc: [],
    },
  },
  {
    game: "eo1",
    class: "protector",
    displayId: "3",
    imgUrl: "https://i.imgur.com/JgiPmIr.png",
    paths: sharedPathInfo,
    totalColors: 8,

    xStart: 79,
    xEnd: 937,
    yStart: 103,
    yEnd: 1181,

    initialColors: {
      skin: ["#fffde2", "#cb917f"],
      hair: ["#f1a172", "#b5534e"],
      leftEye: ["#edcdab", "#a88b64"],
      rightEye: ["#edcdab", "#a88b64"],
      misc: [],
    },
  },
  {
    game: "eo1",
    class: "protector",
    displayId: "4",
    imgUrl: "https://i.imgur.com/g4uNxbA.png",
    paths: sharedPathInfo,
    totalColors: 8,

    xStart: 87,
    xEnd: 719,
    yStart: 180,
    yEnd: 1183,

    initialColors: {
      skin: ["#d3a697", "#77524b"],
      hair: ["#f19a96", "#a95f57"],
      leftEye: ["#bbc5b2", "#676b59"],
      rightEye: ["#bbc5b2", "#676b59"],
      misc: [],
    },
  },
  {
    game: "eo1",
    class: "protector",
    displayId: "5",
    imgUrl: "https://i.imgur.com/2eiuAIn.png",
    paths: sharedPathInfo,
    totalColors: 8,

    xStart: 166,
    xEnd: 894,
    yStart: 0,
    yEnd: 1280,

    initialColors: {
      skin: ["#f4dac5", "#cb988f"],
      hair: ["#da7c48", "#814246"],
      leftEye: ["#b17850", "#87494a"],
      rightEye: ["#b17850", "#87494a"],
      misc: [],
    },
  },
  {
    game: "eo1",
    class: "medic",
    displayId: "5",
    imgUrl: "https://i.imgur.com/20qTHXw.png",
    paths: sharedPathInfo,
    totalColors: 8,

    xStart: 282,
    xEnd: 813,
    yStart: 176,
    yEnd: 1191,

    initialColors: {
      skin: ["#ffe7cb", "#dc8781"],
      hair: ["#4f4052", "#e1e7c2"],
      leftEye: ["#cec3e7", "#524152"],
      rightEye: ["#cec3e7", "#524152"],
      misc: [],
    },
  },

  {
    game: "eo2",
    class: "guest",
    displayId: "1",
    imgUrl: "https://i.imgur.com/H9DdfNY.png",

    paths: [
      ...sharedPathInfo,
      {
        category: "misc",
        categoryIndex: 0,
        layerIndex: 0,
        path: "M20 500 h 50 v 50 h -50 Z",
      },
      {
        category: "misc",
        categoryIndex: 1,
        layerIndex: 0,
        path: "M20 560 h 50 v 50 h -50 Z",
      },
    ],

    // The Demi-Fiend actually has only 1 color per eye, so the total is
    // supposed should be 8, not 10. First example of why I need to update the
    // colors to be arrays and not fixed-length tuples
    totalColors: 8,

    xStart: 192,
    xEnd: 841,
    yStart: 223,
    yEnd: 1236,

    initialColors: {
      skin: ["#e5d6c1", "#8d6d78"],
      hair: ["#5f5b69", "#000000"],
      leftEye: ["#eadd01", "#ffffff"],
      rightEye: ["#eadd01", "#ffffff"],
      misc: ["#32353c", "#c7fff3"],
    },
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
    "guest",
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
    "guest",
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
    "guest",
  ],
};

export async function mockFetchCharacters(url: string) {
  console.log(`Provided URL: ${url}`);

  const res: ApiResponse = {
    classOrderings,
    characters: characters.map((char, index) => {
      return { ...char, id: String(index) };
    }),
  };

  return new Promise<ApiResponse>((resolve) => {
    window.setTimeout(() => {
      resolve(res);
    }, 400);
  });
}
