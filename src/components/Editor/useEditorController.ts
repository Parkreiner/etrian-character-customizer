/**
 * @file Defines all logic for working with the character editor, which is
 * effectively the entire app.
 *
 * This is a long custom hook, but it felt better to put all the related values
 * and types in one file, rather than arbitrarily split them.
 *
 * The value returned is a discriminated union, which prevents you from
 * accessing any of the properties until you prove to TypeScript that the editor
 * has been initalized.
 */
import { useCallback, useMemo, useReducer } from "react";
import useGameInfoFetch from "@/hooks/useGameInfoFetch";

import { CharacterColors } from "@/typesConstants/colors";
import {
  Character,
  CharsGroupedByGame,
  gameOrigins,
  ClassOrderings,
} from "@/typesConstants/gameData";

type EditorState =
  | { initialized: false }
  | {
      initialized: true;
      selectedCharacterId: Character["id"];
      colors: CharacterColors;
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
  const { data } = useGameInfoFetch();
  const { characters, classOrderings } = data ?? {};

  // Nasty-looking state sync, but it's necessary to make sure Editor doesn't
  // fall victim to singleton behavior. Do not replace with useEffect
  if (!state.initialized && data !== undefined) {
    const startingCharacter =
      data.characters.find((char) => char.class === "protector") ??
      data.characters[0];

    if (startingCharacter) {
      dispatch({
        type: "initialized",
        payload: { startingCharacter },
      });
    }
  }

  const groupedByGame: CharsGroupedByGame = useMemo(() => {
    if (!characters || !classOrderings) return new Map();
    return groupCharacters(characters, classOrderings);
  }, [characters, classOrderings]);

  const changeCharacter = useCallback((newCharacter: Character) => {
    dispatch({ type: "characterPicked", payload: { newCharacter } });
  }, []);

  const selectRandomCharacter = useCallback(() => {
    if (characters === undefined) return;
    const preferredIndex = Math.floor(Math.random() * characters.length);

    dispatch({
      type: "randomCharacterPicked",
      payload: { characters, preferredIndex },
    });
  }, [characters]);

  const replaceColors = useCallback((newColors: CharacterColors) => {
    dispatch({ type: "colorsReplaced", payload: { newColors } });
  }, []);

  if (!state.initialized) {
    return { initialized: false } as const;
  }

  return {
    /**
     * Inidicates whether the rest of the editor has been initialized.
     *
     * Set up as a discriminated union; if initialized is true, everything else
     * will be guaranteed to exist at the type level.
     */
    initialized: true,

    /**
     * Represents state for character data loaded from the server. Available in
     * different formats, depending on your needs. Values are read-only.
     */
    characters: {
      list: data?.characters ?? [],
      groupedByGame,
    },

    /**
     * State specific to the editor. Values are read/write, but values can only
     * be updated in prescribed ways.
     */
    editor: {
      colors: state.colors,
      selectedId: state.selectedCharacterId,
      changeCharacter,
      selectRandomCharacter,
      replaceColors,
    },
  } as const;
}
