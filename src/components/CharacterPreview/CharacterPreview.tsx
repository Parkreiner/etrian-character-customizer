import { useLayoutEffect, useRef } from "react";

import { Character } from "@/typesConstants/gameData";
import { CharacterColors } from "@/typesConstants/colors";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  renderCharacter,
  imageToDataUrl,
} from "./canvasHelpers";

import GuideButton from "./GuideButton";
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
    <div className="flex h-full flex-col flex-nowrap justify-center pt-6">
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

      <div className="mx-auto flex max-w-fit flex-row flex-nowrap items-center gap-x-5 pt-6">
        <GuideButton
          buttonText="Help"
          modalTitle="Help"
          modalDescription="How to use this application"
          buttonTextJustify="right"
        >
          Baba-booey Baba-booey
        </GuideButton>

        <button
          className="select-none rounded-full bg-teal-800 px-7 py-3 text-xl font-medium text-teal-50 shadow-md transition-colors"
          disabled={downloadingDisabled}
          onClick={downloadAllImages}
        >
          Download
        </button>

        <GuideButton
          buttonText="Credits"
          modalTitle="Credits"
          modalDescription="Credits and colophon"
          buttonTextJustify="left"
        >
          Baba-booey Baba-booey
        </GuideButton>
      </div>
    </div>
  );
}
