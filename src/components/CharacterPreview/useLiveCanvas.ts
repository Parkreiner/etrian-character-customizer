import { useLayoutEffect, useRef } from "react";
import { CharacterColors } from "@/typesConstants/colors";
import { Character } from "@/typesConstants/gameData";

export default function useLiveCanvas(
  selectedCharacter: Character | null,
  colors: CharacterColors
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorsRef = useRef(colors);

  useLayoutEffect(() => {
    colorsRef.current = colors;
  }, [colors]);

  useLayoutEffect(() => {
    const canvasContext = canvasRef.current?.getContext("2d") ?? null;
    if (canvasContext === null || selectedCharacter === null) return;

    const sortedEntries = [...selectedCharacter.svgs].sort((entry1, entry2) => {
      return entry1.layerIndex - entry2.layerIndex;
    });

    for (const entry of sortedEntries) {
      const { pathData, category, categoryIndex } = entry;
      const newNode = new Path2D(pathData);

      const fillColor = colorsRef.current[category][categoryIndex] ?? "#000000";
      canvasContext.fillStyle = fillColor;
      canvasContext.fill(newNode);
    }
  }, [selectedCharacter]);

  return canvasRef;
}
