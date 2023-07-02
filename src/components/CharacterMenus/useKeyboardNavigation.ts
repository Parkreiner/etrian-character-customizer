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

  if (arrowKey === "ArrowUp") {
    let prevEntry = cachedGroupIterable.at(0);

    for (const entry of cachedGroupIterable) {
      if (entry === activeEntry) break;
      if (entry.characters.length > 0) {
        prevEntry = entry;
      }
    }

    if (prevEntry === undefined || prevEntry === activeEntry) {
      return null;
    }

    const prevClassList = prevEntry.characters;
    const newIndex = Math.min(activeCharIndex, prevClassList.length - 1);
    return prevClassList[newIndex] ?? null;
  }

  if (arrowKey === "ArrowDown") {
    let nextEntry = cachedGroupIterable.at(-1);

    for (let i = cachedGroupIterable.length - 1; i >= 0; i--) {
      const entry = cachedGroupIterable[i];
      if (entry === undefined || entry === activeEntry) break;

      if (entry.characters.length > 0) {
        nextEntry = entry;
      }
    }

    if (nextEntry === undefined || nextEntry === activeEntry) {
      return null;
    }

    const nextClassList = nextEntry.characters;
    const newIndex = Math.min(activeCharIndex, nextClassList.length - 1);
    return nextClassList[newIndex] ?? null;
  }

  return null;
}

export default function useKeyboardNavigation(
  characterGroups: GroupData,
  character: Character,
  onCharacterChange: (newCharacter: Character) => void
) {
  const elementRef = useRef<HTMLDivElement>(null);

  const groupRef = useRef(characterGroups);
  const characterRef = useRef(character);
  const charChangeRef = useRef(onCharacterChange);

  useEffect(() => {
    groupRef.current = characterGroups;
    characterRef.current = character;
    charChangeRef.current = onCharacterChange;
  }, [characterGroups, character, onCharacterChange]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleKeyboardInput = (event: KeyboardEvent) => {
      const { key } = event;
      if (!isArrowKey(key)) return;

      event.preventDefault();
      const newCharacter = findNewCharacterFromInput(
        groupRef.current,
        characterRef.current,
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
