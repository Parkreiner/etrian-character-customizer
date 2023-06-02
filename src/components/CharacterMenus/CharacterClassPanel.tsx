import { Character } from "@/typesConstants/gameData";
import CharacterButton from "./CharacterButton";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { range } from "@/utils/math";

type Props = {
  gameClass: string;
  characters: readonly Character[];
  selectedCharacterId: string;
  onCharacterChange: (newCharacter: Character) => void;
};

function formatClassName(className: string) {
  return className
    .split(/ +/g)
    .map((word) => word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export default function CharacterClassSection({
  gameClass,
  characters,
  selectedCharacterId,
  onCharacterChange,
}: Props) {
  return (
    <div className="mt-2 flex flex-row flex-nowrap first:mt-0">
      <h3 className="mb-0.5 shrink-0 basis-[40%] text-base font-normal text-white opacity-80">
        {formatClassName(gameClass)}
      </h3>

      {characters.length === 0 ? (
        <div className="flex h-full w-full grow items-center justify-center rounded-md bg-teal-800 py-1">
          <p className="text-xs text-teal-100">Coming Soon!</p>
        </div>
      ) : (
        <ul className="grid w-full grid-cols-5 gap-x-2">
          {characters.map((char, charIndex) => (
            <li key={charIndex}>
              <CharacterButton
                selected={char.id === selectedCharacterId}
                onClick={() => onCharacterChange(char)}
              >
                <VisuallyHidden.Root>Select {char.class} </VisuallyHidden.Root>
                {char.displayId}
              </CharacterButton>
            </li>
          ))}

          {/* Fills in any lists that aren't perfect multiples of 5 */}
          {range((5 - characters.length) % 5).map((num) => (
            <li
              key={num}
              className="rounded-md bg-teal-950 opacity-60"
              role="presentation"
            />
          ))}
        </ul>
      )}
    </div>
  );
}
