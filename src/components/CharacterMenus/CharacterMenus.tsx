import { useMemo } from "react";
import {
  Character,
  ClassOrderings,
  GameOrigin,
} from "@/typesConstants/gameData";

import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import Card from "../Card/Card";
import CharacterClassSection from "./CharacterClassPanel";

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
    <div className="relative flex h-full w-[400px] flex-col flex-nowrap bg-teal-600 p-4">
      <fieldset className="flex-grow overflow-y-hidden">
        <div>
          <legend>
            <VisuallyHidden.Root>Select a character</VisuallyHidden.Root>
          </legend>

          {Array.from(grouped, ([game, gameEntries]) => (
            <div key={game} className="mt-6 [&:nth-child(2)]:mt-0">
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

      <div className="absolute bottom-0 left-0 w-full flex-grow-0 bg-gradient-to-t from-teal-600 to-teal-600/50 pb-4 pt-4">
        <button
          className="mx-auto block max-w-fit rounded-full bg-teal-50 px-4 py-1 font-medium text-teal-900 shadow-lg hover:bg-teal-100"
          onClick={randomizeCharacter}
        >
          Click to randomize
        </button>
      </div>
    </div>
  );
}
