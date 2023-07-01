import { useEffect, useMemo, useRef } from "react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

import {
  Character,
  ClassOrderings,
  GameOrigin,
} from "@/typesConstants/gameData";

import { groupCharacters, moveToFront } from "./localHelpers";
import Card from "@/components/Card";
import OverflowContainer from "@/components/OverflowContainer";
import { useLazyImageLoader } from "@/hooks/useBitmapManager";
import HeaderProvider, { useCurrentHeader } from "@/contexts/HeaderLevels";

import CharacterClassSection from "./CharacterClassPanel";

type Props = {
  characters: readonly Character[];
  classOrderings: ClassOrderings;
  selectedCharacterId: string;
  onCharacterChange: (newCharacter: Character) => void;
  randomizeCharacter: () => void;
};

const nameAliases = {
  eo1: "Etrian Odyssey",
  eo2: "Etrian Odyssey II",
  eo3: "Etrian Odyssey III",
} as const satisfies Record<GameOrigin, string>;

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

  // From here to the return statement, there's some screwy stuff happening to
  // satisfy the dependency arrays while making sure that the on-mount effect
  // only ever runs once
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
    <OverflowContainer.Root inputGroup>
      <OverflowContainer.Header>
        <HeaderTag className="mx-auto flex h-[32px] w-fit flex-col flex-nowrap justify-center rounded-full bg-teal-900 px-5 py-1 text-sm font-normal italic text-teal-100">
          Etrian Character Customizer
        </HeaderTag>
      </OverflowContainer.Header>

      <HeaderProvider>
        <OverflowContainer.FlexContent>
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
        </OverflowContainer.FlexContent>

        <OverflowContainer.FooterButton onClick={randomizeCharacter}>
          Select random character
        </OverflowContainer.FooterButton>
      </HeaderProvider>
    </OverflowContainer.Root>
  );
}
