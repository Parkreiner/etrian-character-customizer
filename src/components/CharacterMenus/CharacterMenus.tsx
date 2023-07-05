import { memo, useEffect, useMemo, useRef } from "react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

import {
  Character,
  ClassOrderings,
  GameOrigin,
} from "@/typesConstants/gameData";

import {
  findGroupEntryFromCharacter,
  groupCharacters,
  moveToFront,
} from "./localHelpers";
import Card from "@/components/Card";
import OverflowContainer from "@/components/OverflowContainer";
import { useLazyImageLoader } from "@/hooks/useBitmapManager";
import HeaderProvider, { useCurrentHeader } from "@/contexts/HeaderLevels";

import CharacterClassSection from "./CharacterClassPanel";
import useCharacterKeyboardNav from "./useCharacterKeyboardNav";

type Props = {
  selectedCharacter: Character;
  characters: readonly Character[];
  classOrderings: ClassOrderings;
  onCharacterChange: (newCharacter: Character) => void;
  randomizeCharacter: () => void;
};

const nameAliases = {
  eo1: "Etrian Odyssey",
  eo2: "Etrian Odyssey II",
  eo3: "Etrian Odyssey III",
} as const satisfies Record<GameOrigin, string>;

const CharacterMenus = memo(function CharacterMenus({
  selectedCharacter,
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

  const { parentRef, activeButtonRef } = useCharacterKeyboardNav(
    grouped,
    selectedCharacter,
    onCharacterChange
  );

  // Code assumes that if you click a button for one class, you're more likely
  // to want to see all the characters from the same class
  const loadAllImagesFromSameClass = (requestedCharacter: Character) => {
    const found = findGroupEntryFromCharacter(requestedCharacter, grouped);
    if (found === undefined) {
      return;
    }

    // Reordering here is a hack because most browsers don't support the
    // fetchPriority property for images. For those browsers, the best you can
    // do is make sure your main image is the very first one processed
    const reordered = moveToFront(found.characters, requestedCharacter.id);

    const abortControllers = reordered.map((char) => {
      const updateAfterLoad = char.id === requestedCharacter.id;
      return loadImage(char.imgUrl, updateAfterLoad).abort;
    });

    return function abortAll() {
      abortControllers.forEach((abort) => abort());
    };
  };

  // From here to the return statement, there's some screwy stuff happening to
  // satisfy the dependency arrays while making sure that the on-mount effect
  // only ever runs once. useCallback would've been even jankier
  const veryHackyOnMountRef = useRef(() => {
    return loadAllImagesFromSameClass(selectedCharacter);
  });

  useEffect(() => {
    const abortAll = veryHackyOnMountRef.current();
    return () => abortAll?.();
  }, []);

  // Exact same function can be reused for all .map calls in render output
  const onCharacterChangeWithPrefetch = (char: Character) => {
    loadAllImagesFromSameClass(char);
    onCharacterChange(char);
  };

  return (
    <OverflowContainer.Root>
      <OverflowContainer.Header>
        <HeaderTag className="mx-auto flex h-[32px] w-fit flex-col flex-nowrap justify-center rounded-full bg-teal-900 px-5 py-1 text-sm font-normal italic text-teal-100">
          Etrian Character Customizer
        </HeaderTag>
      </OverflowContainer.Header>

      <HeaderProvider>
        <OverflowContainer.FlexContent ref={parentRef}>
          <fieldset>
            <legend>
              <VisuallyHidden.Root>Select a character</VisuallyHidden.Root>
            </legend>

            {Array.from(grouped, ([game, gameEntries]) => (
              <div key={game} className="mt-3 [&:nth-child(2)]:mt-0">
                <Card title={nameAliases[game]} striped gapSize="small">
                  {gameEntries.map((entry) => (
                    <CharacterClassSection
                      key={entry.class}
                      gameClass={entry.class}
                      selectedCharacterId={selectedCharacter.id}
                      characters={entry.characters}
                      onCharacterChange={onCharacterChangeWithPrefetch}
                      /**
                       * This is a little chaotic, but even though I'm passing
                       * the same ref into every single CharacterClassSection,
                       * when only one instance should ever use the ref at a
                       * time, the logic further down the subtree will make sure
                       * the ref doesn't get reused in multiple spots per
                       * render. The best alternative was adding useEffect to
                       * every single button that gets rendered, and having the
                       * selected button focus itself when needed, but that
                       * seemed disastrous if the UI ever hits its goal of 200+
                       * characters
                       */
                      activeButtonRef={activeButtonRef}
                    />
                  ))}
                </Card>
              </div>
            ))}
          </fieldset>
        </OverflowContainer.FlexContent>

        <OverflowContainer.FooterButton onClick={randomizeCharacter}>
          Select random character
        </OverflowContainer.FooterButton>
      </HeaderProvider>
    </OverflowContainer.Root>
  );
});

export default CharacterMenus;
