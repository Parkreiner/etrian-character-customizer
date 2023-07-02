import { Character } from "@/typesConstants/gameData";
import { GroupData, GroupEntry } from "./localHelpers";
import { useEffect, useRef } from "react";

const arrowKeys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"] as const;
type ArrowKey = (typeof arrowKeys)[number];

function isArrowKey(value: unknown): value is ArrowKey {
  return typeof value === "string" && arrowKeys.includes(value as ArrowKey);
}

let lastGroup: GroupData | null = null;
let cachedGroupIterable: readonly GroupEntry[] = [];

export function findNewCharacterFromInput(
  characterGroups: GroupData,
  currentCharacter: Character,
  arrowKey: ArrowKey
): Character | null {
  const activeEntry = characterGroups
    .get(currentCharacter.game)
    ?.find((entry) => entry.class === currentCharacter.class);

  if (activeEntry === undefined) {
    return null;
  }

  const activeClassList = activeEntry.characters;
  const activeCharIndex = activeClassList.findIndex(
    (char) => char === currentCharacter
  );

  // Handles left and right inputs; really straightforward
  if (arrowKey === "ArrowLeft") {
    const newCharacter = activeClassList[activeCharIndex - 1];
    return newCharacter ?? null;
  }

  if (arrowKey === "ArrowRight") {
    const newCharacter = activeClassList[activeCharIndex + 1];
    return newCharacter ?? null;
  }

  // Rest of the function handles up/down inputs; much more involved
  if (lastGroup !== characterGroups) {
    lastGroup = characterGroups;
    cachedGroupIterable = [...characterGroups.values()].flat();
  }

  let targetEntry: GroupEntry | undefined;
  if (arrowKey === "ArrowUp") {
    // element isn't the most descriptive name, but having three variants of the
    // word "entry" made it harder to follow the code
    for (const element of cachedGroupIterable) {
      if (element === activeEntry) break;
      if (element.characters.length > 0) {
        targetEntry = element;
      }
    }
  } else {
    for (let i = cachedGroupIterable.length - 1; i >= 0; i--) {
      const element = cachedGroupIterable[i];
      if (element === undefined || element === activeEntry) {
        break;
      }

      if (element.characters.length > 0) {
        targetEntry = element;
      }
    }
  }

  if (targetEntry === undefined) return null;
  const classList = targetEntry.characters;
  const newIndex = Math.min(activeCharIndex, classList.length - 1);
  return classList[newIndex] ?? null;
}

export default function useKeyboardNavigation(
  characterGroups: GroupData,
  currentCharacter: Character,
  onCharacterChange: (newCharacter: Character) => void
) {
  const elementRef = useRef<HTMLDivElement>(null);

  const groupRef = useRef(characterGroups);
  const currentCharacterRef = useRef(currentCharacter);
  const charChangeRef = useRef(onCharacterChange);

  useEffect(() => {
    groupRef.current = characterGroups;
    currentCharacterRef.current = currentCharacter;
    charChangeRef.current = onCharacterChange;
  }, [characterGroups, currentCharacter, onCharacterChange]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleKeyboardInput = (event: KeyboardEvent) => {
      const { key } = event;
      if (!isArrowKey(key)) return;

      event.preventDefault();
      const newCharacter = findNewCharacterFromInput(
        groupRef.current,
        currentCharacterRef.current,
        key
      );

      if (newCharacter !== null) {
        charChangeRef.current(newCharacter);
      }
    };

    element.addEventListener("keydown", handleKeyboardInput);
    return () => element.removeEventListener("keydown", handleKeyboardInput);
  }, []);

  return elementRef;
}
