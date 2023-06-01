import { CanvasPathEntry } from "@/typesConstants/gameData";
import { CharacterColors } from "@/typesConstants/colors";

const PLACEHOLDER_FILL = "#ff00ff";
export const CANVAS_WIDTH = 600;
export const CANVAS_HEIGHT = 960;

export function renderCharacter(
  canvasContext: CanvasRenderingContext2D,
  characterImage: HTMLImageElement,
  colors: CharacterColors,
  pathEntries: readonly CanvasPathEntry[]
): void {
  const sortedSvgs = [...pathEntries].sort((entry1, entry2) => {
    return entry1.layerIndex - entry2.layerIndex;
  });

  for (const entry of sortedSvgs) {
    const { path: pathData, category, categoryIndex } = entry;
    const pathNode = new Path2D(pathData);
    const fillColor = colors[category][categoryIndex] ?? PLACEHOLDER_FILL;
    canvasContext.fillStyle = fillColor;
    canvasContext.fill(pathNode);
  }

  const height = CANVAS_WIDTH * (characterImage.height / characterImage.width);
  canvasContext.drawImage(characterImage, 0, 0, CANVAS_WIDTH, height);
}

export function imageToDataUrl(
  image: HTMLImageElement,
  colors: CharacterColors,
  pathEntries: readonly CanvasPathEntry[]
): string {
  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = image.width;
  outputCanvas.height = image.height;

  const outputContext = outputCanvas.getContext("2d");
  if (outputContext === null) {
    throw new Error(
      "outputCanvas declared with multiple rendering contexts - this should be physically impossible"
    );
  }

  renderCharacter(outputContext, image, colors, pathEntries);
  return outputCanvas.toDataURL();
}
