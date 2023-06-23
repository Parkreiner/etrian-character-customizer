import { useEffect, useMemo, useRef } from "react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

import {
  Character,
  ClassOrderings,
  GameOrigin,
} from "@/typesConstants/gameData";

import Card from "@/components/Card";
import CharacterClassSection from "./CharacterClassPanel";
import styles from "@/components/ControlsContainer/scrollbar.module.css";
import HeaderProvider, { useCurrentHeader } from "@/contexts/HeaderLevels";
import { useLazyImageLoader } from "@/hooks/useBitmapManager";

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
    <section className="flex h-full w-[430px] shrink-0 flex-col flex-nowrap bg-teal-600 pb-1.5">
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

      {/*
       * 2023-06-09 - This is a really weird trick to avoid a strange CSS bug
       * specific to Chrome. (Firefox did not have this issue.)
       *
       * You would hope that the relative/absolute positioning, along with the
       * overflows, wouldn't be necessary, but alas.
       *
       * Basically, Chrome would freak out whenever you would try to have
       * overflow on a container with interactive elements (like the buttons).
       * The content would be *visually* clipped wherever it should be, but
       * Chrome would still act as if though it were taking up space in the
       * layout and would cause weird element stretching.
       *
       * The weird thing is, it would behave normally as long as you were only
       * hiding non-interactive elements (like plain text).
       *
       * The most surefire way to fix this was by removing the container from
       * the flow altogether.
       */}
      <fieldset className="relative flex-grow">
        <div className="absolute h-full w-full overflow-y-hidden pb-0.5 pl-6 pr-4 pt-5">
          <div className={`${styles.scrollbar} h-full overflow-y-auto pr-4`}>
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
          </div>
        </div>
      </fieldset>
    </section>
  );
}
