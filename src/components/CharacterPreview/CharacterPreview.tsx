import { useEffect, useLayoutEffect, useRef } from "react";

import { Character } from "@/typesConstants/gameData";
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

function createDataUrl(
  imageNode: HTMLImageElement,
  colors: CharacterColors,
  svgs: Character["svgs"]
): string {
  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = imageNode.width;
  outputCanvas.height = imageNode.height;

  ////////////////////////////
  // Put drawing logic here //
  ////////////////////////////

  return outputCanvas.toDataURL();
}

function downloadCharacter(filename: string, dataUrl: string): void {
  const fakeAnchor = document.createElement("a");
  fakeAnchor.download = filename;
  fakeAnchor.href = dataUrl;

  fakeAnchor.click();
}

/**
 * Notes about implementing this:
 * - I think that the two canvases approach is actually the best way forward. If
 *   I only had one, I would need to resize the canvas to the dimensions of the
 *   image, download it, and then switch it back. It would look janky and no
 *   matter how fast the operation, would probably cause UI flicker
 *
 *   By having two, I have one canvas that will always be the preview canvas,
 *   and one that can resize itself as aggressively for the final output image
 *   as needed, without making the UI look weird.
 * - Because I have two canvases, they actually have slightly different concerns
 *   when it comes to resizing themselves. The preview canvas wants to stay
 *   responsive at all times, while the output canvas wants to be as accurate to
 *   the source images as possible
 * - Because you never see the output canvas, I feel that I don't actually need
 *   to draw on it in most situations. I feel like I could get away with waiting
 *   to draw on it until downloadCharacter runs. I just need to be sure to clear
 *   out the canvas afterwards. Actually, it might make sense to not render an
 *   output canvas at all, and only make it as part of the downloadCharacter
 *   function.
 * - Placing any kind of shape on the canvas doesn't seem that bad. It feels
 *   like the real challenge is going to be in figuring out WHERE to place them.
 */
export default function CharacterPreview({ selectedCharacter, colors }: Props) {
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const previewContext = previewCanvasRef.current?.getContext("2d") ?? null;
    if (previewContext === null || selectedCharacter === null) return;

    const sortedEntries = [...selectedCharacter.svgs].sort((entry1, entry2) => {
      return entry1.layerIndex - entry2.layerIndex;
    });

    for (const entry of sortedEntries) {
      const { pathData, category, categoryIndex } = entry;
      const pathNode = new Path2D(pathData);

      const fillColor = colors[category][categoryIndex] ?? placeholderFill;
      previewContext.fillStyle = fillColor;
      previewContext.fill(pathNode);
    }

    // Still need to add image and clipping stuff here

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
    const { id, colors, svgs, imgUrl, class: className } = selectedCharacter;

    try {
      const characterImage = await getCharacterImage(imgUrl);
      const dataUrl = createDataUrl(characterImage, colors, svgs);
      const colorsHash = btoa(JSON.stringify(colors));
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
