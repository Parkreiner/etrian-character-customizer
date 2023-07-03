import {
  Character,
  GameOrigin,
  ClassOrderings,
} from "@/typesConstants/gameData";

export type GroupEntry = { class: string; characters: readonly Character[] };
export type GroupData = Map<GameOrigin, readonly GroupEntry[]>;

export function groupCharacters(
  characters: readonly Character[],
  classOrderings: ClassOrderings
): GroupData {
  const sortedChars = [...characters].sort((char1, char2) => {
    if (char1.displayId === char2.displayId) return 0;
    return char1.displayId < char2.displayId ? -1 : 1;
  });

  type Entries = readonly [keyof ClassOrderings, readonly string[]][];
  const entries = Object.entries(classOrderings).sort((entry1, entry2) => {
    if (entry1[0] === entry2[0]) return 0;
    return entry1[0] < entry2[0] ? -1 : 1;
  }) as Entries;

  // Using a Map to guarantee insertion order is respected
  const grouped = new Map<GameOrigin, readonly GroupEntry[]>();

  const filterChars = (game: GameOrigin, gameClass: string) => {
    return sortedChars.filter((char) => {
      return char.game === game && char.class === gameClass;
    });
  };

  for (const [game, charClasses] of entries) {
    const entriesByGame = charClasses.map((className): GroupEntry => {
      return { class: className, characters: filterChars(game, className) };
    });

    grouped.set(game, entriesByGame);
  }

  return grouped;
}

export function moveToFront<T extends { id: string }>(
  list: readonly T[],
  targetId: string
): readonly T[] {
  const moveIndex = list.findIndex((item) => item.id === targetId);
  if (moveIndex === -1 || moveIndex === 0) {
    return list;
  }

  const copy = [...list];
  const plucked = copy.splice(moveIndex, 1);
  copy.splice(0, 0, ...plucked);

  return copy;
}

export function findGroupEntryFromCharacter(
  character: Character,
  characterGroups: GroupData
): GroupEntry | undefined {
  return characterGroups
    .get(character.game)
    ?.find((entry) => entry.class === character.class);
}
