import { useReducer } from "react";
import { Character } from "@/typesConstants/gameData";
import { CharacterColors } from "@/typesConstants/colors";

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

export default function useEditorReducer() {
  return useReducer(reduceEditorState, initialEditorState);
}
