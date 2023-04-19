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
      className="flex min-h-[100px] flex-grow basis-[100px] items-center justify-center rounded-md border-2 border-black"
      style={{ backgroundColor: color }}
    >
      <div className="rounded-md bg-black px-2 py-1 text-sm font-semibold text-white">
        {children}
      </div>
    </div>
  );
}

export default function CharacterPreview({ selectedCharacter, colors }: Props) {
  const characterClass = selectedCharacter?.class ?? "Unknown";
  const displayedId = selectedCharacter?.id ?? "Unknown";

  return (
    <div className="flex flex-grow flex-col flex-nowrap justify-center self-stretch p-6">
      <p>
        Class: {characterClass}
        <br />
        ID: {displayedId}
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
    </div>
  );
}
