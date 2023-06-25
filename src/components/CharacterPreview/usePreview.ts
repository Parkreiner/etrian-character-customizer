import { useLayoutEffect, useRef, useState } from "react";

import { getCanvasContext, renderCharacter } from "./canvasHelpers";
import { CharacterColors } from "@/typesConstants/colors";
import { Character } from "@/typesConstants/gameData";

/**
 * Alternative ideas if the double-rendering from useState becomes an issue:
 * - Remove the two useStates and the previous useLayoutEffect, in favor of
 *   making this run with no dependency array. If I handle the conditional
 *   logic in the effect, I think that could potentially avoid the double-
 *   render issues. No dependency array feels weird, though
 *
 *   The effect would just read the values from the container directly and
 *   resize the canvas to match. Not sure if that would mean I would have to
 *   combine the rendering effect here as well
 */
export default function usePreview(
  bitmap: ImageBitmap | null,
  colors: CharacterColors,
  character: Character
) {
  // Have to initialize as null because dimensions won't exist until after first
  // mount. Storing values separately to make effect dependencies easier
  const [availableWidth, setAvailableWidth] = useState<number | null>(null);
  const [availableHeight, setAvailableHeight] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Subscribe React to any changes in the container's dimensions
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (container === null) return;

    const copySizeChangesToState: ResizeObserverCallback = (entries) => {
      const sizeInfo = entries[0]?.contentBoxSize[0];
      if (sizeInfo === undefined) return;

      setAvailableWidth(sizeInfo.inlineSize);
      setAvailableHeight(sizeInfo.blockSize);
    };

    const observer = new ResizeObserver(copySizeChangesToState);
    observer.observe(container, { box: "border-box" });
    return () => observer.disconnect();
  }, []);

  // Resize the canvas dimensions based on container and bitmap size. Cannot
  // use ANY sizing CSS on canvas whatsoever, or else the output distorts
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const ready =
      canvas !== null &&
      bitmap !== null &&
      availableWidth !== null &&
      availableHeight !== null;

    if (!ready) return;

    let width: number;
    let height: number;
    if (bitmap.height >= bitmap.width) {
      const aspectConversionRatio = bitmap.width / bitmap.height;
      height = Math.min(availableHeight, bitmap.height);
      width = height * aspectConversionRatio;
    } else {
      const aspectConversionRatio = bitmap.height / bitmap.width;
      width = Math.min(availableWidth, bitmap.width);
      height = width * aspectConversionRatio;
    }

    canvas.width = width;
    canvas.height = height;
  }, [bitmap, availableWidth, availableHeight]);

  // Renders character to the canvas when image input changes
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const canRender =
      canvas !== null &&
      bitmap !== null &&
      availableWidth !== null &&
      availableHeight !== null;

    if (!canRender) return;

    const previewContext = getCanvasContext(canvas);
    renderCharacter(canvas, bitmap, colors, character);

    return () => {
      previewContext.fillStyle = "#000000";
      previewContext.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [bitmap, character, colors, availableWidth, availableHeight]);

  return { containerRef, canvasRef } as const;
}
