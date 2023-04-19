import { Character } from "@/typesConstants/gameData";
import { CharacterColors } from "@/typesConstants/colors";
import Button from "@/components/Button";
import DebugSquare from "./DebugSquare";

type Props = {
  selectedCharacterId: string;
  colors: CharacterColors;
  characters: readonly Character[];
};

async function downloadCharacter(
  characterId: string,
  colors: Character["colors"]
) {
  const inputPreview =
    `Character ID: ${characterId}\n\n` + JSON.stringify(colors, null, 2);

  window.alert(inputPreview);
}

export default function CharacterPreview({
  selectedCharacterId,
  colors,
  characters,
}: Props) {
  const selectedCharacter =
    characters.find((char) => char.id === selectedCharacterId) ?? null;

  const characterClass = selectedCharacter?.class ?? "Unknown";

  return (
    <div className="flex flex-grow flex-col flex-nowrap justify-center self-stretch p-6">
      <p>
        Class: {characterClass}
        <br />
        ID: {selectedCharacterId}
      </p>

      <div className="my-4 flex flex-row flex-wrap gap-4 justify-self-center">
        <DebugSquare color={colors.skin[0]}>Skin 1</DebugSquare>
        <DebugSquare color={colors.skin[1]}>Skin 2</DebugSquare>

        <DebugSquare color={colors.hair[0]}>Hair 1</DebugSquare>
        <DebugSquare color={colors.hair[1]}>Hair 2</DebugSquare>

        <DebugSquare color={colors.leftEye[0]}>L. Eye 1</DebugSquare>
        <DebugSquare color={colors.leftEye[1]}>L. Eye 2</DebugSquare>

        <DebugSquare color={colors.rightEye[0]}>R. Eye 1</DebugSquare>
        <DebugSquare color={colors.rightEye[1]}>R. Eye 2</DebugSquare>

        {colors.misc.map((color, index) => (
          <DebugSquare key={index} color={color}>
            Misc {index + 1}
          </DebugSquare>
        ))}
      </div>

      <div className="mx-auto max-w-fit pt-6">
        <Button
          intent="primary"
          size="large"
          disabled={selectedCharacter === null}
          onClick={() => {
            if (selectedCharacter !== null) {
              downloadCharacter(selectedCharacterId, colors);
            }
          }}
        >
          Download
        </Button>
      </div>
    </div>
  );
}
