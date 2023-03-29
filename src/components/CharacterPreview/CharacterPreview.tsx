import { Character } from "@/typesConstants/gameData";
import { CharacterColors } from "@/typesConstants/colors";

type Props = {
  selectedCharacter: Character | null;
  colors: CharacterColors;
};

export default function CharacterPreview({ selectedCharacter, colors }: Props) {
  const characterClass = selectedCharacter?.class ?? "Unknown";
  const id = selectedCharacter?.id ?? "Unknown";

  return (
    <div className="min-w-[500px] flex-grow self-stretch bg-white">
      <p>
        Class: {characterClass}
        <br />
        ID: {id}
      </p>

      <div
        className="h-[200px] w-[200px]"
        style={{ backgroundColor: colors.skin[0] }}
      />
    </div>
  );
}
