import { useLayoutEffect, useRef } from "react";

import { Character } from "@/typesConstants/gameData";
import { CharacterColors } from "@/typesConstants/colors";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  renderCharacter,
  imageToDataUrl,
} from "./canvasHelpers";

import Button from "@/components/Button";
import useImageCache from "@/hooks/useImageCache";

type Props = {
  selectedCharacter: Character | null;
  colors: CharacterColors;
};

function downloadCharacter(filename: string, dataUrl: string): void {
  const fakeAnchor = document.createElement("a");
  fakeAnchor.download = filename;
  fakeAnchor.href = dataUrl;

  fakeAnchor.click();
}

export default function CharacterPreview({ selectedCharacter, colors }: Props) {
  // Might need to add some state for tracking the status of this component
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const { processImage } = useImageCache();

  useLayoutEffect(() => {
    const previewContext = previewCanvasRef.current?.getContext("2d") ?? null;
    if (previewContext === null || selectedCharacter === null) return;

    const cleanup = processImage(selectedCharacter.imgUrl, (image) => {
      renderCharacter(previewContext, image, colors, selectedCharacter.paths);
    });

    return () => {
      previewContext.fillStyle = "#000000";
      previewContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      cleanup?.();
    };
  }, [selectedCharacter, colors, processImage]);

  /**
   * Note: the download functionality can't work right now, because the mock
   * images are being hosted on a separate source (Imgur). Browsers will treat
   * the canvas as "tainted" until the image comes from a same-source server
   *
   * @todo At some point, this functionality might need to be updated to process
   * multiple images.
   */
  const downloadAllImages = () => {
    if (selectedCharacter === null) return;

    processImage(selectedCharacter.imgUrl, (image) => {
      const dataUrl = imageToDataUrl(
        image,
        selectedCharacter.initialColors,
        selectedCharacter.paths
      );

      const newFilename = `${selectedCharacter.class}${selectedCharacter.id}`;
      downloadCharacter(newFilename, dataUrl);
    });
  };

  const downloadingDisabled = selectedCharacter === null;

  return (
    <div className="flex flex-col flex-nowrap justify-center self-stretch p-6">
      <canvas
        ref={previewCanvasRef}
        className="mx-auto w-[450px] grow-0 border-2 border-black"
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
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
          onClick={downloadAllImages}
        >
          Download
        </Button>
      </div>
    </div>
  );
}
