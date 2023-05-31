import { Character } from "@/typesConstants/gameData";
import CharacterButton from "./CharacterButton";
import Card from "@/components/Card";

type Props = {
  gameClass: string;
  characters: readonly Character[];
  selectedCharacterId: string;
  onCharacterChange: (newCharacter: Character) => void;
};

export default function CharacterPanel({
  gameClass,
  characters,
  selectedCharacterId,
  onCharacterChange,
}: Props) {
  const classLabelName =
    gameClass.slice(0, 1).toUpperCase() + gameClass.slice(1).toLowerCase();

  return (
    <Card title={gameClass} striped={false} gapSize="small">
      {characters.length === 0 ? (
        <div className="flex h-full w-full grow items-center justify-center rounded-md bg-teal-800 py-1">
          <p className="text-xs text-teal-100">No Characters</p>
        </div>
      ) : (
        <ol className="flex w-full flex-row gap-x-2">
          {characters.map((char, charIndex) => (
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
      )}
    </Card>
  );
}
