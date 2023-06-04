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
import { useCallback, useReducer } from "react";
import useGameInfoFetch from "@/hooks/useGameInfoFetch";

import { CharacterColors } from "@/typesConstants/colors";
import { Character, ClassOrderings } from "@/typesConstants/gameData";

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
      colors: startingCharacter.initialColors,
    };
  }

  switch (action.type) {
    case "characterPicked": {
      const { newCharacter } = action.payload;
      if (newCharacter.id === state.selectedCharacterId) return state;

      return {
        ...state,
        selectedCharacterId: newCharacter.id,
        colors: newCharacter.initialColors,
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
        colors: currentCharacter.initialColors,
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

const defaultCharactersList = [] satisfies readonly Character[];
const defaultClassOrderings = {
  eo1: [],
  eo2: [],
  eo3: [],
} satisfies ClassOrderings;

export default function useEditorController() {
  const [state, dispatch] = useReducer(reduceEditorState, initialEditorState);
  const { data } = useGameInfoFetch();

  // Nasty-looking state sync, but it's necessary to make sure Editor doesn't
  // fall victim to singleton behavior. Do not replace with useEffect
  if (!state.initialized && data !== undefined) {
    const startingCharacter =
      data.characters.find(
        (char) => char.class === "protector" && char.displayId === "5"
      ) ?? data.characters[0];

    if (startingCharacter) {
      dispatch({
        type: "initialized",
        payload: { startingCharacter },
      });
    }
  }

  const characters = data?.characters ?? defaultCharactersList;
  const classOrderings = data?.classOrderings ?? defaultClassOrderings;

  const changeCharacter = useCallback((newCharacter: Character) => {
    dispatch({ type: "characterPicked", payload: { newCharacter } });
  }, []);

  const selectRandomCharacter = useCallback(() => {
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

  const selectedCharacter = characters.find(
    (char) => char.id === state.selectedCharacterId
  );

  if (selectedCharacter === undefined) {
    throw new Error(
      "Unable to find selected character in array after initialization"
    );
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
     * Represents state borrowed from the server. All values are read-only.
     *
     * As the app grows bigger, it might make sense to remove this in favor of
     * having components consume useGameInfoFetch directly. However, the trade-
     * off is that every component consuming the hook would need to start
     * handling cases for data being undefined, instead of having that logic be
     * resolved in one spot (Editor).
     */
    server: { characters, classOrderings },

    /**
     * Represents derived values that should be available to any component
     * consuming this hook. No state should go in here.
     */
    derived: { selectedCharacter },

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
