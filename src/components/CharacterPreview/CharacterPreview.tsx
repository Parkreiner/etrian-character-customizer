import { useEffect, useLayoutEffect, useRef } from "react";

import { CanvasPathEntry, Character } from "@/typesConstants/gameData";
import { CharacterColors } from "@/typesConstants/colors";

import Button from "@/components/Button";
import useImageLoading from "../../hooks/useImageCache";

type Props = {
  selectedCharacter: Character | null;
  colors: CharacterColors;
};

const placeholderFill = "#ff00ff";
const canvasWidth = 600;
const canvasHeight = 960;

function renderCharacter(
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
    const fillColor = colors[category][categoryIndex] ?? placeholderFill;
    canvasContext.fillStyle = fillColor;
    canvasContext.fill(pathNode);
  }

  const height = canvasWidth * (characterImage.height / characterImage.width);
  canvasContext.drawImage(characterImage, 0, 0, canvasWidth, height);
}

function createDataUrl(
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

function downloadCharacter(filename: string, dataUrl: string): void {
  const fakeAnchor = document.createElement("a");
  fakeAnchor.download = filename;
  fakeAnchor.href = dataUrl;

  fakeAnchor.click();
}

export default function CharacterPreview({ selectedCharacter, colors }: Props) {
  // Might need to add some state for tracking the status of this component
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const { processImage } = useImageLoading();

  useLayoutEffect(() => {
    const previewContext = previewCanvasRef.current?.getContext("2d") ?? null;
    if (previewContext === null || selectedCharacter === null) return;

    const cleanup = processImage(selectedCharacter.imgUrl, (image) => {
      renderCharacter(previewContext, image, colors, selectedCharacter.paths);
    });

    return () => {
      previewContext.fillStyle = "#000000";
      previewContext.clearRect(0, 0, canvasWidth, canvasHeight);
      if (cleanup !== undefined) cleanup();
    };
  }, [selectedCharacter, colors, processImage]);

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

  // Note: the download functionality can't work right now, because the mock
  // image is being hosted on a separate source (Imgur). The browsers will treat
  // the canvas as "tainted" until the image comes from a same-source server
  const download = () => {
    if (selectedCharacter === null) return;

    processImage(selectedCharacter.imgUrl, (image) => {
      const dataUrl = createDataUrl(
        image,
        selectedCharacter.initialColors,
        selectedCharacter.paths
      );

      const colorsHash = btoa(JSON.stringify(selectedCharacter.initialColors));
      const newFilename = `${selectedCharacter.class}${selectedCharacter.id}_${colorsHash}`;

      downloadCharacter(newFilename, dataUrl);
    });
  };

  const downloadingDisabled = selectedCharacter === null;

  return (
    <div className="flex flex-col flex-nowrap justify-center self-stretch p-6">
      <canvas
        ref={previewCanvasRef}
        className="mx-auto w-[450px] grow-0 border-2 border-black"
        width={canvasWidth}
        height={canvasHeight}
      >
        A preview of
        {selectedCharacter === null && "no character"}
        {selectedCharacter !== null &&
          `a ${selectedCharacter.class} from ${selectedCharacter.game}`}
      </canvas>

      <div className="mx-auto max-w-fit pt-6">
        <Button
          intent="primary"
          size="large"
          disabled={downloadingDisabled}
          onClick={download}
        >
          Download
        </Button>
      </div>
    </div>
  );
}
