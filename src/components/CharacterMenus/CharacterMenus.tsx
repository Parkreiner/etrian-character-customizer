import { useMemo } from "react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

import {
  Character,
  ClassOrderings,
  GameOrigin,
} from "@/typesConstants/gameData";

import Card from "@/components/Card";
import CharacterClassSection from "./CharacterClassPanel";
import styles from "./scrollbar.module.css";

type Props = {
  characters: readonly Character[];
  classOrderings: ClassOrderings;
  selectedCharacterId: string;
  onCharacterChange: (newCharacter: Character) => void;
  randomizeCharacter: () => void;
};

type GroupEntry = { class: string; characters: readonly Character[] };

const nameAliases = {
  eo1: "Etrian Odyssey",
  eo2: "Etrian Odyssey II",
  eo3: "Etrian Odyssey III",
} as const satisfies Record<GameOrigin, string>;

function groupCharacters(
  characters: readonly Character[],
  classOrderings: ClassOrderings
): Map<GameOrigin, readonly GroupEntry[]> {
  const sortedChars = [...characters].sort((char1, char2) => {
    if (char1.id === char2.id) return 0;
    return char1.id < char2.id ? -1 : 1;
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

export default function CharacterMenus({
  selectedCharacterId,
  characters,
  classOrderings,
  onCharacterChange,
  randomizeCharacter,
}: Props) {
  const grouped = useMemo(
    () => groupCharacters(characters, classOrderings),
    [characters, classOrderings]
  );

  return (
    <div className="flex h-full w-[450px] flex-col flex-nowrap bg-teal-600 pb-1.5 pl-6 pr-5 pt-3">
      <button
        className="mx-auto mb-3 block max-w-fit rounded-full bg-teal-100 px-4 py-1 text-sm font-medium text-teal-900 shadow-lg transition-colors hover:bg-teal-200"
        onClick={randomizeCharacter}
      >
        Randomize
      </button>

      <fieldset className="flex-grow overflow-y-hidden">
        <div
          className={`${styles.scrollbar} h-full overflow-y-scroll pb-1 pr-5`}
        >
          <legend>
            <VisuallyHidden.Root>Select a character</VisuallyHidden.Root>
          </legend>

          {Array.from(grouped, ([game, gameEntries]) => (
            <div key={game} className="mt-5 [&:nth-child(2)]:mt-0">
              <Card title={nameAliases[game]} striped gapSize="small">
                {gameEntries.map((entry) => (
                  <CharacterClassSection
                    key={entry.class}
                    gameClass={entry.class}
                    selectedCharacterId={selectedCharacterId}
                    characters={entry.characters}
                    onCharacterChange={onCharacterChange}
                  />
                ))}
              </Card>
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
