import { useEffect, useLayoutEffect, useRef, useState } from "react";

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
  const [downloading, setDownloading] = useState(false);
  const {
    bitmap: image,
    status,
    loadImage,
  } = useLazyImageLoading(character.imgUrl);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const previewContext = previewCanvasRef.current?.getContext("2d") ?? null;
    if (previewContext === null || image === null) return;

    renderCharacter(previewContext, image, colors, character.paths);

    return () => {
      previewContext.fillStyle = "#000000";
      previewContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    };
  }, [image, colors, character.paths]);

  useEffect(() => {
    if (image !== null) return;
    const { abort } = loadImage(character.imgUrl);
    return () => abort();
  }, [image, character.imgUrl, loadImage]);

  // Note: the download functionality can't work right now, because the mock
  // images are being hosted on a separate source (Imgur). Browsers will treat
  // the canvas as "tainted" until the image comes from a same-source server
  const downloadAllImages = () => {
    if (image === null) return;
    setDownloading(true);

    Promise.resolve().then(() => {
      try {
        const dataUrl = imageToDataUrl(
          image,
          character.initialColors,
          character.paths
        );

        const newFilename = `${character.class}${character.id}`;
        downloadCharacter(newFilename, dataUrl);
      } catch (err) {
        console.error(err);
      }

      setDownloading(false);
    });
  };

  const downloadsDisabled =
    downloading || status === "error" || status === "loading";

  return (
    <div className="flex h-full flex-col flex-nowrap justify-center pt-6">
      <canvas
        ref={previewCanvasRef}
        className="mx-auto w-[450px] grow-0 border-2 border-teal-700"
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      >
        <img src="http://cool.cool.cocol" alt="Blah" />A preview of a{" "}
        {character.class} from {character.game}
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
