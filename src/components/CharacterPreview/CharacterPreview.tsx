import { Character } from "@/typesConstants/gameData";
import { CharacterColors } from "@/typesConstants/colors";
import { PropsWithChildren } from "react";

type Props = {
  selectedCharacter: Character | null;
  colors: CharacterColors;
};

type DebugSquareProps = PropsWithChildren<{
  color: string;
}>;

function DebugSquare({ color, children }: DebugSquareProps) {
  return (
    <div
      className="flex h-[100px] w-[100px] items-center justify-center"
      style={{ backgroundColor: color }}
    >
      <div>{children}</div>
    </div>
  );
}

export default function CharacterPreview({ selectedCharacter, colors }: Props) {
  const characterClass = selectedCharacter?.class ?? "Unknown";
  const id = selectedCharacter?.id ?? "Unknown";

  return (
    <div className="flex-grow self-stretch rounded-md bg-white p-6">
      <p>
        Class: {characterClass}
        <br />
        ID: {id}
      </p>

      <div className="flex flex-row flex-wrap gap-2">
        <DebugSquare color={colors.skin[0]}>Skin 1</DebugSquare>
        <DebugSquare color={colors.skin[1]}>Skin 2</DebugSquare>

        <DebugSquare color={colors.hair[0]}>Hair 1</DebugSquare>
        <DebugSquare color={colors.hair[1]}>Hair 2</DebugSquare>

        <DebugSquare color={colors.leftEye[0]}>L. Eyes 1</DebugSquare>
        <DebugSquare color={colors.leftEye[1]}>L. Eyes 2</DebugSquare>

        <DebugSquare color={colors.rightEye[0]}>R. Eyes 1</DebugSquare>
        <DebugSquare color={colors.rightEye[1]}>R. Eyes 2</DebugSquare>

        {colors.misc.map((color, index) => (
          <DebugSquare key={index} color={color}>
            Misc {index + 1}
          </DebugSquare>
        ))}
      </div>
    </div>
  );
}
