import { Character } from "@/typesConstants/gameData";
import { CharacterColors } from "@/typesConstants/colors";

const PLACEHOLDER_FILL = "#ff00ff";
export const CANVAS_WIDTH = 600;
export const CANVAS_HEIGHT = 960;

export function renderCharacter(
  canvasContext: CanvasRenderingContext2D,
  charBitmap: ImageBitmap,
  colors: CharacterColors,
  character: Character
): void {
  const sortedPaths = [...character.paths].sort((entry1, entry2) => {
    return entry1.layerIndex - entry2.layerIndex;
  });

  for (const entry of sortedPaths) {
    const { path: pathData, category, categoryIndex } = entry;
    const pathNode = new Path2D(pathData);
    const fillColor = colors[category][categoryIndex] ?? PLACEHOLDER_FILL;
    canvasContext.fillStyle = fillColor;
    canvasContext.fill(pathNode);
  }

  const height = CANVAS_WIDTH * (charBitmap.height / charBitmap.width);
  canvasContext.drawImage(charBitmap, 0, 0, CANVAS_WIDTH, height);
}

export function imageToDataUrl(
  charBitmap: ImageBitmap,
  colors: CharacterColors,
  character: Character
): string {
  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = charBitmap.width;
  outputCanvas.height = charBitmap.height;

  const outputContext = outputCanvas.getContext("2d");
  if (outputContext === null) {
    throw new Error(
      "outputCanvas declared with multiple rendering contexts - this should be physically impossible"
    );
  }

  renderCharacter(outputContext, charBitmap, colors, character);
  return outputCanvas.toDataURL();
}
