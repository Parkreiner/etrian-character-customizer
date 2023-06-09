import { useEffect, useState } from "react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

import { Character } from "@/typesConstants/gameData";
import { CharacterColors } from "@/typesConstants/colors";
import { imageToDataUrl } from "./canvasHelpers";

import GuideButton from "./GuideButton";
import useLazyImageLoading from "@/hooks/useLazyImageLoading";
import { handleError } from "@/utils/errors";
import usePreview from "./usePreview";

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
  const { containerRef, canvasRef } = usePreview(bitmap, colors, character);

  useEffect(() => {
    if (bitmap !== null) return;
    const { abort } = loadImage(character.imgUrl);
    return () => abort();
  }, [bitmap, character.imgUrl, loadImage]);

  // Note: the download functionality can't work right now, because the mock
  // images are being hosted on a separate source (Imgur). Browsers will treat
  // the canvas as "tainted" until the image comes from a same-source server
  const downloadAllImages = async () => {
    const canvas = canvasRef.current;
    if (bitmap === null || canvas === null) return;
    setIsDownloading(true);

    // This looks hokey, but it ensures that the first state update finishes
    // before the rest of this function (which is expensive) is allowed to start
    await Promise.resolve();

    try {
      const dataUrl = imageToDataUrl(bitmap, colors, character);
      const newFilename = `${character.class}${character.id}`;
      downloadCharacter(newFilename, dataUrl);
    } catch (err) {
      handleError(err);
    }

    window.alert(
      "Basic download functionality not in place just yet; need to resolve issues with cross-site image sources."
    );

    setIsDownloading(false);
  };

  const downloadsDisabled =
    isDownloading || status === "error" || status === "loading";

  return (
    <section className="flex h-full flex-grow flex-col flex-nowrap justify-center gap-y-4 py-10">
      <div ref={containerRef} className="w-full flex-shrink flex-grow py-4">
        {/*
         * Reminder: You cannot set any CSS properties on a canvas that would
         * change its size. You have to update the HTML directly (doing the
         * math for it), or else the canvas output will become distorted
         */}
        <canvas ref={canvasRef} className="mx-auto">
          A preview of a {character.class} from {character.game}
        </canvas>
      </div>

      <div>
        <fieldset className="mx-auto flex max-w-fit flex-row flex-nowrap items-center gap-x-4">
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
            className="select-none rounded-full bg-teal-800 px-7 py-3 text-xl font-medium text-teal-50 shadow-md shadow-sky-700/30 transition-colors duration-200 ease-in-out hover:bg-teal-700"
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
            target="_blank"
            rel="noreferrer"
          >
            Check the GitHub page
          </a>{" "}
          for updates.
        </p>
      </div>
    </section>
  );
}
