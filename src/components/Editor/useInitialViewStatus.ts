/**
 * @file Slightly wonky hook for making sure that the app is only treated as
 * being fully loaded once both the editor data and the initial image have been
 * loaded in.
 *
 * Kept running into cases (especially on bad connections) where the editor
 * state would load faster than the image, leading to the user seeing a loading
 * screen on the canvas – right after sitting through another loading screen
 *
 * The vast majority of apps do not need to do this – it's a safeguard that's
 * needed here because this app involves direct image manipulation. Without an
 * image, the app is useless.
 */
import { useState } from "react";
import useBitmapManager from "@/hooks/useBitmapManager";

export default function useInitialViewStatus(
  editorInitialized: boolean,
  imageUrl: string | null
) {
  const [ready, setReady] = useState(false);
  const [initialUrl, setInitialUrl] = useState(imageUrl);
  const { status: imageStatus } = useBitmapManager(initialUrl);

  const firstImageLoaded = initialUrl === null && typeof imageUrl === "string";
  if (firstImageLoaded) {
    setInitialUrl(imageUrl);
  }

  const editorAndImageReady =
    editorInitialized && imageStatus !== "idle" && imageStatus !== "loading";

  if (!ready && editorAndImageReady) {
    setReady(true);
  }

  return ready;
}
