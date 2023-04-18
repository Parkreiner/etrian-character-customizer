import { useCallback, useMemo, useReducer } from "react";
import useGameInfoFetch from "./useGameInfoFetch";

import { ClassOrderings } from "./localTypes";
import { CharacterColors } from "@/typesConstants/colors";
import {
  Character,
  CharsGroupedByGame,
  gameOrigins,
} from "@/typesConstants/gameData";

type EditorState =
  | { initialized: false }
  | {
      initialized: true;
      selectedCharacterId: Character["id"];
      colors: Character["colors"];
    };

type EditorAction =
  | { type: "initialized"; payload: { startingCharacter: Character } }
  | { type: "colorsReplaced"; payload: { newColors: CharacterColors } }
  | { type: "characterPicked"; payload: { newCharacter: Character } }
  | {
      type: "randomCharacterPicked";
      payload: { characters: readonly Character[]; preferredIndex: number };
    };

const initialEditorState = {
  initialized: false,
} as const satisfies EditorState;

export function reduceEditorState(
  state: EditorState,
  action: EditorAction
): EditorState {
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
    case "characterPicked": {
      const { newCharacter } = action.payload;
      if (newCharacter.id === state.selectedCharacterId) return state;

      return {
        ...state,
        selectedCharacterId: newCharacter.id,
        colors: newCharacter.colors,
      };
    }

    case "randomCharacterPicked": {
      const { characters, preferredIndex } = action.payload;
      if (characters.length < 2) return state;

      let currentIndex = preferredIndex;
      let currentCharacter = characters[currentIndex];

      while (currentCharacter?.id === state.selectedCharacterId) {
        currentIndex = (currentIndex + 1) % characters.length;
        currentCharacter = characters[currentIndex];
      }

      if (currentCharacter === undefined) {
        return state;
      }

      return {
        ...state,
        selectedCharacterId: currentCharacter.id,
        colors: currentCharacter.colors,
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

export default function useEditor() {
  const [state, dispatch] = useReducer(reduceEditorState, initialEditorState);

  const { data } = useGameInfoFetch((response) => {
    const startingCharacter =
      response.characters.find((char) => char.class === "protector") ??
      response.characters[0];

    if (!startingCharacter) {
      return;
    }

    dispatch({
      type: "initialized",
      payload: { startingCharacter },
    });
  });

  const { characters, classOrderings } = data ?? {};

  const groupedCharacters = useMemo(() => {
    if (!characters || !classOrderings) return null;
    return groupCharacters(characters, classOrderings);
  }, [characters, classOrderings]);

  const changeCharacter = useCallback(
    (newCharacter: Character) => {
      dispatch({ type: "characterPicked", payload: { newCharacter } });
    },
    [dispatch]
  );

  const selectRandomCharacter = useCallback(() => {
    if (characters === undefined) return;
    const preferredIndex = Math.floor(
      Math.random() * (characters?.length ?? 0)
    );

    dispatch({
      type: "randomCharacterPicked",
      payload: { characters, preferredIndex },
    });
  }, [characters, dispatch]);

  const replaceColors = useCallback(
    (newColors: CharacterColors) => {
      dispatch({ type: "colorsReplaced", payload: { newColors } });
    },
    [dispatch]
  );

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
    stateUpdaters: {
      changeCharacter,
      selectRandomCharacter,
      replaceColors,
    },
  } as const;
}
