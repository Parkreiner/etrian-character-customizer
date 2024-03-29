import { useEffect, useRef } from "react";
import { Character } from "@/typesConstants/gameData";
import { ArrowKey, isArrowKey } from "@/utils/keyboard";
import {
  GroupData,
  GroupEntry,
  findGroupEntryFromCharacter,
} from "./localHelpers";

let lastGroup: GroupData | null = null;
let cachedGroupIterable: readonly GroupEntry[] = [];

export function findNewCharacterFromInput(
  characterGroups: GroupData,
  currentCharacter: Character,
  arrowKey: ArrowKey
): Character | null {
  const activeEntry = findGroupEntryFromCharacter(
    currentCharacter,
    characterGroups
  );

  if (activeEntry === undefined) {
    return null;
  }

  const activeClassList = activeEntry.characters;
  const activeCharIndex = activeClassList.findIndex(
    (char) => char === currentCharacter
  );

  // Handles left and right inputs; really straightforward
  if (arrowKey === "ArrowLeft") {
    return activeClassList.at(activeCharIndex - 1) ?? null;
  }

  if (arrowKey === "ArrowRight") {
    const newIndex = (activeCharIndex + 1) % activeClassList.length;
    return activeClassList.at(newIndex) ?? null;
  }

  // Rest of the function handles up/down inputs; much more involved
  if (lastGroup !== characterGroups) {
    lastGroup = characterGroups;
    cachedGroupIterable = [...characterGroups.values()].flat();
  }

  // Each arrow key has two cases to deal with (to wrap around or not). Each
  // case *superficially* looks similar, but trying to force everything into
  // one abstraction is just going to make the code harder to maintain. A lil'
  // copy-pasting never hurt nobody, as long as it's in controlled doses
  let target: GroupEntry | undefined = undefined;
  if (arrowKey === "ArrowUp") {
    const firstGroupWithChars = cachedGroupIterable.find(
      (group) => group.characters.length > 0
    );

    const needWrap = activeEntry === firstGroupWithChars;
    if (needWrap) {
      for (let i = cachedGroupIterable.length - 1; i >= 0; i--) {
        const entry = cachedGroupIterable[i];
        if (entry === undefined) break;

        if (entry.characters.length > 0) {
          target = entry;
          break;
        }
      }
    } else {
      for (const entry of cachedGroupIterable) {
        if (entry === activeEntry) break;
        if (entry.characters.length > 0) {
          target = entry;
        }
      }
    }
  }

  // Not defined as else in the off chance that unexpected input slips in
  else if (arrowKey === "ArrowDown") {
    // Even with ESNext build option, Vercel complained about using
    // Array.findLast. Have to swap out for manual loop
    let lastGroupWithChars: GroupEntry | undefined = undefined;
    for (let i = cachedGroupIterable.length - 1; i >= 0; i--) {
      const entry = cachedGroupIterable[i];
      if (entry === undefined) break;
      if (entry.characters.length > 0) {
        lastGroupWithChars = entry;
        break;
      }
    }

    const needWrap = activeEntry === lastGroupWithChars;
    if (needWrap) {
      for (const entry of cachedGroupIterable) {
        if (entry.characters.length > 0) {
          target = entry;
          break;
        }
      }
    } else {
      for (let i = cachedGroupIterable.length - 1; i >= 0; i--) {
        const iterableEntry = cachedGroupIterable[i];
        if (iterableEntry === undefined || iterableEntry === activeEntry) {
          break;
        }

        if (iterableEntry.characters.length > 0) {
          target = iterableEntry;
        }
      }
    }
  }

  if (target === undefined) return null;
  const classList = target.characters;
  const newIndex = Math.min(activeCharIndex, classList.length - 1);
  return classList[newIndex] ?? null;
}

export default function useCharacterKeyboardNav(
  characterGroups: GroupData,
  currentCharacter: Character,
  onCharacterChange: (newCharacter: Character) => void
) {
  const parentRef = useRef<HTMLDivElement>(null);
  const activeButtonRef = useRef<HTMLButtonElement>(null);

  const groupRef = useRef(characterGroups);
  const currentCharacterRef = useRef(currentCharacter);
  const charChangeRef = useRef(onCharacterChange);

  useEffect(() => {
    groupRef.current = characterGroups;
    currentCharacterRef.current = currentCharacter;
    charChangeRef.current = onCharacterChange;
  }, [characterGroups, currentCharacter, onCharacterChange]);

  useEffect(() => {
    const element = parentRef.current;
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

  // Main logic for focus management - only shifts focus for character buttons
  // if the parent already has inner focus
  useEffect(() => {
    const parent = parentRef.current;
    if (parent === null) return;

    if (parent.contains(document.activeElement)) {
      activeButtonRef.current?.focus();
    }
  }, [currentCharacter]);

  // On mount, just make the focus happen unconditionally to spare the user
  // some extra tabbing
  useEffect(() => {
    activeButtonRef.current?.focus();
  }, []);

  return { parentRef, activeButtonRef } as const;
}
