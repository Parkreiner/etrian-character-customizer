import { useEffect, useState } from "react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

import { Character } from "@/typesConstants/gameData";
import { CharacterColors } from "@/typesConstants/colors";
import { imageToDataUrl } from "./canvasHelpers";

import { handleError } from "@/utils/errors";
import useBitmapManager from "@/hooks/useBitmapManager";
import usePreview from "./usePreview";
import CreditsButton from "./CreditsButton";
import HelpButton from "./HelpButton";

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
  const { bitmap, status, loadImage } = useBitmapManager(character.imgUrl);
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
      <div
        ref={containerRef}
        className="relative w-full flex-shrink flex-grow py-4"
      >
        {/*
         * Extra container with absolute positioning is necessary to avoid
         * unexpected behavior with ResizeObserver callback.
         *
         * Basically:
         * 1. The canvas is supposed to fit itself to the container
         * 2. But since the canvas can't have CSS properties on it, you can't
         *    tell it to make its size dependent on its parent
         * 3. Because of this, the container will be allowed to grow (and the
         *    canvas will grow to match it), but it won't be allowed to shrink,
         *    because then it would be cutting off the canvas.
         * 4. Because the container is only allowed to grow, the resizer
         *    callback only runs when you grow the container. It will never run
         *    when you shrink it.
         * 5. The only fix is to remove the element from the flow, but you can't
         *    do the size changes on the canvas itself – because again, it might
         *    warp.
         */}
        <div className="absolute h-full w-full">
          {/*
           * Reminder: You cannot set any CSS properties on a canvas that would
           * change its size. You have to update the HTML directly (doing the
           * math for it), or else the canvas output will become distorted
           */}
          <canvas ref={canvasRef} className="mx-auto block">
            A preview of a {character.class} from {character.game}
          </canvas>
        </div>
      </div>

      <div>
        <fieldset className="mx-auto flex max-w-fit flex-row flex-nowrap items-center gap-x-4">
          <legend>
            <VisuallyHidden.Root>Main app button controls</VisuallyHidden.Root>
          </legend>

          <HelpButton />

          <button
            type="button"
            className="select-none rounded-full bg-teal-800 px-7 py-3 text-xl font-medium text-teal-50 shadow-md shadow-sky-700/30 transition-colors duration-200 ease-in-out hover:bg-teal-700"
            disabled={downloadsDisabled}
            onClick={downloadAllImages}
          >
            Download
          </button>

          <CreditsButton />
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
