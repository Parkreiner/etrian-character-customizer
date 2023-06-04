import { Character } from "@/typesConstants/gameData";
import { CharacterColors } from "@/typesConstants/colors";

const PLACEHOLDER_FILL = "#ff00ff";

export function getCanvasContext(
  canvas: HTMLCanvasElement
): CanvasRenderingContext2D {
  const context = canvas.getContext("2d");
  if (context === null) {
    throw new Error(
      "Rendering context is null. This should only be possible if you accidentally set up multiple contexts for the same canvas"
    );
  }

  return context;
}

export function renderCharacter(
  canvas: HTMLCanvasElement,
  charBitmap: ImageBitmap,
  colors: CharacterColors,
  character: Character
): void {
  const canvasContext = getCanvasContext(canvas);
  const width = canvas.width;
  const height = canvas.height;

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

  canvasContext.drawImage(charBitmap, 0, 0, width, height);
}

export function imageToDataUrl(
  charBitmap: ImageBitmap,
  colors: CharacterColors,
  character: Character
): string {
  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = charBitmap.width;
  outputCanvas.height = charBitmap.height;

  renderCharacter(outputCanvas, charBitmap, colors, character);
  return outputCanvas.toDataURL();
}
