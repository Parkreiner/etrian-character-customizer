import { useEffect, useLayoutEffect, useRef } from "react";

import { CanvasPathEntry, Character } from "@/typesConstants/gameData";
import { CharacterColors } from "@/typesConstants/colors";

import DebugSquare from "./DebugSquare";
import Button from "@/components/Button";

type Props = {
  selectedCharacter: Character | null;
  colors: CharacterColors;
};

const placeholderFill = "#ff00ff";
const canvasWidth = 600;
const canvasHeight = 600;

async function getCharacterImage(url: string): Promise<HTMLImageElement> {
  const characterImage = new Image();
  return new Promise((resolve, reject) => {
    characterImage.onload = () => resolve(characterImage);
    characterImage.onerror = reject;
    characterImage.src = url;
  });
}

function drawToCanvas(
  canvasContext: CanvasRenderingContext2D,
  colors: CharacterColors,
  pathEntries: readonly CanvasPathEntry[]
): void {
  const sortedSvgs = [...pathEntries].sort((entry1, entry2) => {
    return entry1.layerIndex - entry2.layerIndex;
  });

  for (const entry of sortedSvgs) {
    const { path: pathData, category, categoryIndex } = entry;
    const pathNode = new Path2D(pathData);

    const fillColor = colors[category][categoryIndex] ?? placeholderFill;
    canvasContext.fillStyle = fillColor;
    canvasContext.fill(pathNode);
  }
}

function createDataUrl(
  imageNode: HTMLImageElement,
  colors: CharacterColors,
  pathEntries: readonly CanvasPathEntry[]
): string {
  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = imageNode.width;
  outputCanvas.height = imageNode.height;

  const outputContext = outputCanvas.getContext("2d");
  if (outputContext === null) {
    throw new Error(
      "outputCanvas declared with multiple rendering contexts - this should be physically impossible"
    );
  }

  drawToCanvas(outputContext, colors, pathEntries);
  return outputCanvas.toDataURL();
}

function downloadCharacter(filename: string, dataUrl: string): void {
  const fakeAnchor = document.createElement("a");
  fakeAnchor.download = filename;
  fakeAnchor.href = dataUrl;

  fakeAnchor.click();
}

export default function CharacterPreview({ selectedCharacter, colors }: Props) {
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const previewContext = previewCanvasRef.current?.getContext("2d") ?? null;
    if (previewContext === null || selectedCharacter === null) return;

    drawToCanvas(previewContext, colors, selectedCharacter.paths);
    return () => {
      previewContext.fillStyle = "#000000";
      previewContext.clearRect(0, 0, canvasWidth, canvasHeight);
    };
  }, [selectedCharacter, colors]);

  // Not an effect for the app - just using this to learn HTML canvas
  useEffect(() => {
    const visibleContext = previewCanvasRef.current?.getContext("2d") ?? null;
    if (visibleContext === null) return;

    // Copy and paste canvas examples here

    return () => {
      visibleContext.fillStyle = "rgb(0, 0, 0)";
      visibleContext.clearRect(0, 0, canvasWidth, canvasHeight);
    };
  }, []);

  const processDownload = async () => {
    if (selectedCharacter === null) return;
    const {
      id,
      initialColors,
      paths,
      imgUrl,
      class: className,
    } = selectedCharacter;

    try {
      const characterImage = await getCharacterImage(imgUrl);
      const dataUrl = createDataUrl(characterImage, initialColors, paths);
      const colorsHash = btoa(JSON.stringify(initialColors));
      const newFilename = `${className}${id}_${colorsHash}`;

      downloadCharacter(newFilename, dataUrl);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-grow flex-col flex-nowrap justify-center self-stretch p-6">
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

      <div>
        <canvas
          ref={previewCanvasRef}
          className="mx-auto h-[450px] w-[450px] border-2 border-black"
          width={canvasWidth}
          height={canvasHeight}
        >
          A preview of
          {selectedCharacter === null && "no character"}
          {selectedCharacter !== null &&
            `a ${selectedCharacter.class} from ${selectedCharacter.game}`}
        </canvas>
      </div>

      <div className="mx-auto max-w-fit pt-6">
        <Button
          intent="primary"
          size="large"
          disabled={selectedCharacter === null}
          onClick={processDownload}
        >
          Download
        </Button>
      </div>
    </div>
  );
}
