import { useEffect, useLayoutEffect, useRef } from "react";

import { Character } from "@/typesConstants/gameData";
import { CharacterColors } from "@/typesConstants/colors";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  renderCharacter,
  imageToDataUrl,
} from "./canvasHelpers";

import GuideButton from "./GuideButton";
import useLazyImageLoading from "@/hooks/useLazyImageLoading";

type Props = {
  character: Character;
  colors: CharacterColors;
};

function downloadCharacter(filename: string, dataUrl: string): void {
  const fakeAnchor = document.createElement("a");
  fakeAnchor.download = filename;
  fakeAnchor.href = dataUrl;

  fakeAnchor.click();
}

export default function CharacterPreview({ character, colors }: Props) {
  const { imageInfo, loadImage } = useLazyImageLoading(character.imgUrl);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const previewContext = previewCanvasRef.current?.getContext("2d") ?? null;
    if (previewContext === null || imageInfo.image === null) return;

    renderCharacter(previewContext, imageInfo.image, colors, character.paths);

    return () => {
      previewContext.fillStyle = "#000000";
      previewContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    };
  }, [imageInfo.image, colors, character.paths]);

  useEffect(() => {
    if (imageInfo.image !== null) return;
    const { cleanup } = loadImage(character.imgUrl);
    return () => cleanup();
  }, [imageInfo.image, character.imgUrl, loadImage]);

  // Note: the download functionality can't work right now, because the mock
  // images are being hosted on a separate source (Imgur). Browsers will treat
  // the canvas as "tainted" until the image comes from a same-source server
  const downloadAllImages = () => {
    if (imageInfo.image === null) return;

    Promise.resolve().then(() => {
      const dataUrl = imageToDataUrl(
        imageInfo.image,
        character.initialColors,
        character.paths
      );

      const newFilename = `${character.class}${character.id}`;
      downloadCharacter(newFilename, dataUrl);
    });
  };

  const downloadsDisabled =
    imageInfo.status === "error" || imageInfo.status === "loading";

  return (
    <div className="flex h-full flex-col flex-nowrap justify-center pt-6">
      <canvas
        ref={previewCanvasRef}
        className="mx-auto w-[450px] grow-0 border-2 border-teal-700"
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      >
        A preview of a {character.class} from {character.game}
      </canvas>

      <div className="mx-auto flex max-w-fit flex-row flex-nowrap items-center gap-x-4 pt-6">
        <GuideButton
          buttonText="Help"
          modalTitle="Help"
          modalDescription="How to use this application"
        >
          Baba-booey Baba-booey
        </GuideButton>

        <button
          className="select-none rounded-full bg-teal-800 px-7 py-3 text-xl font-medium text-teal-50 shadow-md transition-colors"
          disabled={downloadsDisabled}
          onClick={downloadAllImages}
        >
          Download
        </button>

        <GuideButton
          buttonText="Credits"
          modalTitle="Credits"
          modalDescription="Credits and colophon"
        >
          Baba-booey Baba-booey
        </GuideButton>
      </div>
    </div>
  );
}
