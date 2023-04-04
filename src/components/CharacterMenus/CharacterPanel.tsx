import { Character } from "@/typesConstants/gameData";
import CharacterButton from "./CharacterButton";

type Props = {
  gameClass: string;
  characterList: readonly Character[];
  selectedCharacterId: string;
  onCharacterChange: (newCharacter: Character) => void;
};

export default function CharacterPanel({
  gameClass,
  characterList,
  selectedCharacterId,
  onCharacterChange,
}: Props) {
  const classLabelName =
    gameClass.slice(0, 1).toUpperCase() + gameClass.slice(1).toLowerCase();

  return (
    <section className="rounded-md bg-teal-900 p-4">
      <h2 className="text-xs font-semibold tracking-wider text-teal-50">
        {gameClass.toUpperCase()}
      </h2>

      <ol className="mt-2 flex w-full flex-row gap-x-2">
        {characterList.map((char, charIndex) => (
          <li key={charIndex} className="flex-grow">
            <CharacterButton
              selected={char.id === selectedCharacterId}
              displayNumber={charIndex + 1}
              labelText={`Select ${classLabelName} ${charIndex + 1}`}
              onClick={() => onCharacterChange(char)}
            />
          </li>
        ))}
      </ol>
    </section>
  );
}
