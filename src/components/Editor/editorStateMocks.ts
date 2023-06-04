import {
  CanvasPathEntry,
  Character,
  ClassOrderings,
} from "@/typesConstants/gameData";
import { ApiResponse } from "@/hooks/useGameInfoFetch";

const basePathMocks: Character["paths"] = [
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

const misc1: CanvasPathEntry = {
  category: "misc",
  categoryIndex: 0,
  layerIndex: 0,
  path: "M20 500 h 50 v 50 h -50 Z",
};

const misc2: CanvasPathEntry = {
  category: "misc",
  categoryIndex: 1,
  layerIndex: 0,
  path: "M20 560 h 50 v 50 h -50 Z",
};

const misc3: CanvasPathEntry = {
  category: "misc",
  categoryIndex: 2,
  layerIndex: 0,
  path: "M20 620 h 50 v 50 h -50 Z",
};

const characters: readonly Omit<Character, "id">[] = [
  // EO1 Protector 1
  {
    game: "eo1",
    class: "protector",
    displayId: "1",
    imgUrl: "https://i.imgur.com/7I1k2X2.png",
    paths: basePathMocks,
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

  // EO1 Teach
  {
    game: "eo1",
    class: "protector",
    displayId: "2",
    imgUrl: "https://i.imgur.com/xfqdPUn.png",
    paths: basePathMocks,
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

  // EO1 protector 3
  {
    game: "eo1",
    class: "protector",
    displayId: "3",
    imgUrl: "https://i.imgur.com/8AAoLIK.png",
    paths: basePathMocks,
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

  // EO1 protector 4
  {
    game: "eo1",
    class: "protector",
    displayId: "4",
    imgUrl: "https://i.imgur.com/eAA3iZP.png",
    paths: basePathMocks,
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

  // New protector (EO1 version)
  {
    game: "eo1",
    class: "protector",
    displayId: "5",
    imgUrl: "https://i.imgur.com/nkNMx5E.png",
    paths: basePathMocks,
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

  // New medic (EO1 version)
  {
    game: "eo1",
    class: "medic",
    displayId: "5",
    imgUrl: "https://i.imgur.com/K4Y78kh.png",
    paths: basePathMocks,
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

  // Demi-Fiend (EO2)
  {
    game: "eo2",
    class: "guest",
    displayId: "1",
    imgUrl: "https://i.imgur.com/5jTaytn.png",
    paths: [...basePathMocks, misc1, misc2],

    // The Demi-Fiend actually has only 1 color per eye, so the total is
    // supposed to be 8, not 10. First example of why I need to update the
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

  // New Gunner
  {
    game: "eo2",
    class: "gunner",
    displayId: "5",
    imgUrl: "https://i.imgur.com/mW4fl9G.png",
    paths: [...basePathMocks, misc1, misc2],

    // Gunner also only has one eye color - at least, as far as I can tell with
    // all the image compression going on in the base image
    totalColors: 8,

    xStart: 218,
    xEnd: 824,
    yStart: 154,
    yEnd: 1180,

    initialColors: {
      skin: ["#fce5cb", "#eca29c"],
      hair: ["#4f3f63", "#31283e"],
      leftEye: ["#4f3f63", "#ffffff"],
      rightEye: ["#4f3f63", "#ffffff"],
      misc: ["#392f3c", "#781d29"],
    },
  },

  // Joker (EO1)
  {
    game: "eo1",
    class: "guest",
    displayId: "1",
    imgUrl: "https://i.imgur.com/bWSsXTM.png",
    paths: [...basePathMocks, misc1],
    totalColors: 9,

    xStart: 41,
    xEnd: 936,
    yStart: 257,
    yEnd: 1280,

    initialColors: {
      skin: ["#ffe0bd", "#b5878f"],
      hair: ["#685e5d", "#2e2c2e"],
      leftEye: ["#7394c3", "#364258"],
      rightEye: ["#7394c3", "#364258"],
      misc: ["#810c0d"],
    },
  },

  // Ringo (EO1)
  {
    game: "eo1",
    class: "guest",
    displayId: "2",
    imgUrl: "https://i.imgur.com/NVSUUHt.png",
    paths: [...basePathMocks, misc1, misc2, misc3],
    totalColors: 11,

    xStart: 67,
    xEnd: 830,
    yStart: 168,
    yEnd: 1109,

    // There are actually a ton of shades of green in Ringo's portrait, and the
    // image compression will make editing them harder than it should be.
    // Leaning towards only letting you customize the hair, not the jacket
    initialColors: {
      skin: ["#ffefd6", "#ce9389"],
      hair: ["#e1e9c6", "#9ca678"],
      leftEye: ["#ff96ff", "#c86786"],
      rightEye: ["#ff96ff", "#c86786"],
      misc: ["#ffff00", "#7bdb18", "#088c91"],
    },
  },

  // Aigis (EO3)
  {
    game: "eo3",
    class: "guest",
    displayId: "2",
    imgUrl: "https://i.imgur.com/M57BmSu.png",
    paths: [...basePathMocks, misc1, misc2],
    totalColors: 11,

    xStart: 535,
    xEnd: 1459,
    yStart: 504,
    yEnd: 1769,

    // There are actually a ton of shades of green in this portrait, and the
    // image compression will make editing them harder than it should be.
    // Leaning towards only letting you customize the hair, not the jacket
    initialColors: {
      skin: ["#ffe9d0", "#c88d8c"],
      hair: ["#ece884", "#a57b55"],
      leftEye: ["#8ecfcb", "#5d9291"],
      rightEye: ["#8ecfcb", "#5d9291"],
      misc: ["#cb2a33", "#841010"],
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
