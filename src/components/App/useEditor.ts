import { useCallback, useMemo } from "react";
import { ClassOrderings } from "./localTypes";
import useGameInfoFetch from "./useGameInfoFetch";
import useEditorReducer from "./useEditorReducer";
import { CharacterColors } from "@/typesConstants/colors";

import {
  Character,
  CharsGroupedByGame,
  gameOrigins,
} from "@/typesConstants/gameData";

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
  const [state, dispatch] = useEditorReducer();

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
