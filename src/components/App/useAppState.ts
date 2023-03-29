import { useMemo, useReducer } from "react";
import useSwr from "swr";
import { mockFetchCharacters } from "./appStateMocks";
import { CharacterColors } from "@/typesConstants/colors";
import {
  Character,
  CharsGroupedByGame,
  GameOrigin,
  gameOrigins,
} from "@/typesConstants/gameData";

const CHARACTERS_ENDPOINT = "/api/characters";

type ClientState =
  | { initialized: false }
  | {
      initialized: true;
      selectedCharacterId: Character["id"];
      colors: Character["colors"];
    };

type ClientAction =
  | { type: "initialized"; payload: { startingCharacter: Character } }
  | { type: "characterChanged"; payload: { newCharacter: Character } }
  | { type: "colorsReplaced"; payload: { newColors: CharacterColors } };

export function reduceClientState(
  state: ClientState,
  action: ClientAction
): ClientState {
  if (!state.initialized) {
    if (action.type !== "initialized") {
      return state;
    }

    const { startingCharacter } = action.payload;
    return {
      initialized: true,
      selectedCharacterId: startingCharacter.id,
      colors: startingCharacter.colors,
    };
  }

  switch (action.type) {
    case "characterChanged": {
      const { newCharacter } = action.payload;
      return {
        ...state,
        selectedCharacterId: newCharacter.id,
        colors: newCharacter.colors,
      };
    }

    case "colorsReplaced": {
      return {
        ...state,
        colors: action.payload.newColors,
      };
    }

    default: {
      return state;
    }
  }
}

/**
 * The idea is that this type would just be a record, where each game forms a
 * key, and the value for the key is the classes in the game, listed in order.
 */
type ClassOrderings = Record<GameOrigin, string[]>;

export type ApiResponse = {
  characters: Character[];
  classOrderings: ClassOrderings;
};

async function fetchCharacters(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Server responded with error");
  }

  return response.json() as Promise<ApiResponse>;
}

function groupCharacters(
  characters: Character[],
  orderings: ClassOrderings
): CharsGroupedByGame {
  const grouped: CharsGroupedByGame = new Map(
    gameOrigins.map((game) => {
      const charOrder = orderings[game];
      const charsPerGame = new Map(
        charOrder.map((gameClass) => [gameClass, []])
      );

      return [game, charsPerGame];
    })
  );

  for (const char of characters) {
    const classArray = grouped.get(char.game)?.get(char.class);
    if (classArray !== undefined) {
      classArray.push(char);
    }
  }

  return grouped;
}

const initialClientState = {
  initialized: false,
} as const satisfies ClientState;

export default function useAppState() {
  const [state, dispatch] = useReducer(reduceClientState, initialClientState);

  const { data } = useSwr<ApiResponse, Error>(
    CHARACTERS_ENDPOINT,
    mockFetchCharacters,
    {
      errorRetryCount: 3,
      onSuccess: (data) => {
        const startingCharacter = data.characters[0];
        if (!startingCharacter) {
          return;
        }

        dispatch({
          type: "initialized",
          payload: { startingCharacter },
        });
      },
    }
  );

  const { characters, classOrderings } = data ?? {};

  const groupedCharacters = useMemo(() => {
    if (!characters || !classOrderings) return null;
    return groupCharacters(characters, classOrderings);
  }, [characters, classOrderings]);

  const stateUpdaters = useMemo(() => {
    return {
      changeCharacter: (newCharacter: Character) => {
        dispatch({
          type: "characterChanged",
          payload: { newCharacter },
        });
      },

      replaceColors: (newColors: CharacterColors) => {
        dispatch({
          type: "colorsReplaced",
          payload: { newColors },
        });
      },
    } as const;
  }, []);

  if (!state.initialized) {
    return { initialized: false } as const;
  }

  if (groupedCharacters === null) {
    throw new Error("Grouped characters null even after initialization");
  }

  const { selectedCharacterId, colors } = state;

  const selectedCharacter =
    characters?.find((char) => char.id === selectedCharacterId) ?? null;

  return {
    initialized: true,
    groupedCharacters,
    selectedCharacter,
    colors,
    stateUpdaters,
  } as const;
}
