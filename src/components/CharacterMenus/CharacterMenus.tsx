import { useEffect, useMemo, useRef } from "react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

import {
  Character,
  ClassOrderings,
  GameOrigin,
} from "@/typesConstants/gameData";

import Card from "@/components/Card";
import OverflowContainer from "@/components/OverflowContainer";
import { useLazyImageLoader } from "@/hooks/useBitmapManager";

import CharacterClassSection from "./CharacterClassPanel";
import HeaderProvider, { useCurrentHeader } from "@/contexts/HeaderLevels";

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

function moveToFront<T extends { id: string }>(
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

export default function CharacterMenus({
  selectedCharacterId,
  characters,
  classOrderings,
  onCharacterChange,
  randomizeCharacter,
}: Props) {
  const HeaderTag = useCurrentHeader();
  const loadImage = useLazyImageLoader();

  const grouped = useMemo(
    () => groupCharacters(characters, classOrderings),
    [characters, classOrderings]
  );

  const loadAllImagesFromSameClass = (requestedCharacter: Character) => {
    // Code assumes that if you click a button for one class, you're more likely
    // to want to see the characters from the same class.
    const characterList = grouped
      .get(requestedCharacter.game)
      ?.find((entry) => entry.class === requestedCharacter.class)?.characters;

    if (characterList === undefined) {
      return;
    }

    // Reordering here is a hack because most browsers don't support the
    // fetchPriority property for images. For those browsers, the best you can
    // do is make sure your main image is the very first one processed
    const reordered = moveToFront(characterList, requestedCharacter.id);

    const abortControllers = reordered.map((char) => {
      const updateAfterLoad = char.id === requestedCharacter.id;
      return loadImage(char.imgUrl, updateAfterLoad).abort;
    });

    return function abortAll() {
      abortControllers.forEach((abort) => abort());
    };
  };

  // Tried defining all this stuff lower in the component tree, but the problem
  // was that the mount-only effect would run for each individual class, which
  // absolutely isn't what I need. One effect total, on mount only.
  const veryHackyOnMountRef = useRef(() => {
    const initialCharacter = characters.find(
      (char) => char.id === selectedCharacterId
    );

    if (initialCharacter !== undefined) {
      return loadAllImagesFromSameClass(initialCharacter);
    }
  });

  useEffect(() => {
    const abortAll = veryHackyOnMountRef.current();
    return () => abortAll?.();
  }, []);

  return (
    <OverflowContainer.Root>
      <OverflowContainer.Header>
        <section className="flex flex-nowrap items-baseline justify-between bg-teal-100 py-3 pl-7 pr-5">
          <HeaderTag className="text-base font-medium italic text-teal-950">
            Etrian Character Customizer
          </HeaderTag>

          <button
            className="block max-w-fit rounded-full border-[1px] border-teal-900/70 bg-teal-100 px-4 py-1 text-sm font-medium text-teal-900 transition-colors hover:bg-teal-200"
            onClick={randomizeCharacter}
          >
            Randomize
          </button>
        </section>
      </OverflowContainer.Header>

      <OverflowContainer.FlexContent inputGroup>
        <legend>
          <VisuallyHidden.Root>Select a character</VisuallyHidden.Root>
        </legend>

        <HeaderProvider>
          {Array.from(grouped, ([game, gameEntries]) => (
            <div key={game} className="mt-5 [&:nth-child(2)]:mt-0">
              <Card title={nameAliases[game]} striped gapSize="small">
                {gameEntries.map((entry) => (
                  <CharacterClassSection
                    key={entry.class}
                    gameClass={entry.class}
                    selectedCharacterId={selectedCharacterId}
                    characters={entry.characters}
                    onCharacterChange={(char) => {
                      loadAllImagesFromSameClass(char);
                      onCharacterChange(char);
                    }}
                  />
                ))}
              </Card>
            </div>
          ))}
        </HeaderProvider>
      </OverflowContainer.FlexContent>
    </OverflowContainer.Root>
  );
}
