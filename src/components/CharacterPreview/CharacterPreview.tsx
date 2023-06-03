import { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

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
import { handleError } from "@/utils/errors";

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
  const [isDownloading, setIsDownloading] = useState(false);
  const { bitmap, status, loadImage } = useLazyImageLoading(character.imgUrl);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const previewContext = previewCanvasRef.current?.getContext("2d") ?? null;
    if (previewContext === null || bitmap === null) return;

    renderCharacter(previewContext, bitmap, colors, character.paths);

    return () => {
      previewContext.fillStyle = "#000000";
      previewContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    };
  }, [bitmap, colors, character.paths]);

  useEffect(() => {
    if (bitmap !== null) return;
    const { abort } = loadImage(character.imgUrl);
    return () => abort();
  }, [bitmap, character.imgUrl, loadImage]);

  // Note: the download functionality can't work right now, because the mock
  // images are being hosted on a separate source (Imgur). Browsers will treat
  // the canvas as "tainted" until the image comes from a same-source server
  const downloadAllImages = () => {
    if (bitmap === null) return;
    setIsDownloading(true);

    Promise.resolve().then(() => {
      try {
        const dataUrl = imageToDataUrl(
          bitmap,
          character.initialColors,
          character.paths
        );

        const newFilename = `${character.class}${character.id}`;
        downloadCharacter(newFilename, dataUrl);
      } catch (err) {
        handleError(err);
      }

      window.alert(
        "Basic download functionality not in place just yet; need to resolve issues with cross-site image sources."
      );

      setIsDownloading(false);
    });
  };

  const downloadsDisabled =
    isDownloading || status === "error" || status === "loading";

  return (
    <section className="flex h-full flex-grow flex-col flex-nowrap justify-center pt-6">
      <canvas
        ref={previewCanvasRef}
        className="mx-auto w-[450px] grow-0 border-2 border-teal-700"
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      >
        A preview of a {character.class} from {character.game}
      </canvas>

      <fieldset className="mx-auto flex max-w-fit flex-row flex-nowrap items-center gap-x-4 pt-6">
        <legend>
          <VisuallyHidden.Root>Main app button controls</VisuallyHidden.Root>
        </legend>

        <GuideButton
          buttonText="Help"
          modalTitle="Help"
          modalDescription="How to use this application"
        >
          Baba-booey Baba-booey
        </GuideButton>

        <button
          type="button"
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
      </fieldset>

      <p className="mx-auto mt-4 w-fit rounded-full bg-yellow-100 px-4 py-2 text-center text-sm font-medium text-yellow-900">
        Work in progress.{" "}
        <a
          className="underline"
          href="https://github.com/Parkreiner/etrian-character-customizer"
        >
          Check the GitHub page
        </a>{" "}
        for updates.
      </p>
    </section>
  );
}
