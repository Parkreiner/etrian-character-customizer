import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

import { Character } from "@/typesConstants/gameData";
import { range } from "@/utils/math";
import { toTitleCase } from "@/utils/strings";
import HeaderProvider, { useCurrentHeader } from "@/contexts/HeaderLevels";
import CharacterButton from "./CharacterButton";

type Props = {
  gameClass: string;
  characters: readonly Character[];
  selectedCharacterId: string;
  onCharacterChange: (newCharacter: Character) => void;
  activeButtonRef?: React.ForwardedRef<HTMLButtonElement>;
};

export default function CharacterClassSection({
  gameClass,
  characters,
  selectedCharacterId,
  onCharacterChange,
  activeButtonRef,
}: Props) {
  const HeaderTag = useCurrentHeader();
  const placeholderSlotsToRender = Math.abs((5 - characters.length) % 5);

  return (
    <div className="mt-3 flex flex-row flex-nowrap items-center first:mt-1">
      <HeaderTag className="shrink-0 basis-[40%] text-base font-normal text-white opacity-80">
        {toTitleCase(gameClass)}
      </HeaderTag>

      <HeaderProvider>
        <div className="h-6 w-full">
          {characters.length === 0 ? (
            <div className="flex h-full items-center justify-center rounded-md bg-teal-800 opacity-80">
              <p className="text-xs text-teal-50">Coming soon!</p>
            </div>
          ) : (
            <ul className="grid h-full w-full grid-cols-5 gap-x-2">
              {characters.map((char) => {
                const selected = char.id === selectedCharacterId;

                return (
                  <li key={char.id}>
                    <CharacterButton
                      selected={selected}
                      onClick={() => onCharacterChange(char)}
                      ref={selected ? activeButtonRef : undefined}
                    >
                      <VisuallyHidden.Root>
                        Select {char.class}{" "}
                      </VisuallyHidden.Root>
                      {char.displayId}
                    </CharacterButton>
                  </li>
                );
              })}

              {range(placeholderSlotsToRender).map((num) => (
                <li key={num} className="rounded-md bg-teal-950 opacity-60">
                  <span role="presentation" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </HeaderProvider>
    </div>
  );
}
