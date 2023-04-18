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
  | { type: "characterChanged"; payload: { newCharacter: Character } }
  | { type: "colorsReplaced"; payload: { newColors: CharacterColors } };

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

export default function useEditorReducer() {
  return useReducer(reduceEditorState, initialEditorState);
}
