/**
 * @todo Also need to export a cache snapshot from the hook so that the cache
 * can start to be used with React state
 */
import { useCallback } from "react";

const imageCache = new Map<string, HTMLImageElement>();

async function getImage(url: string): Promise<HTMLImageElement> {
  const characterImage = new Image();
  return new Promise((resolve, reject) => {
    characterImage.onload = () => {
      imageCache.set(url, characterImage);
      resolve(characterImage);
    };

    characterImage.onerror = reject;
    characterImage.src = url;
  });
}

export default function useImageCache() {
  const loadImage = useCallback((imageUrl: string) => {
    return getImage(imageUrl);
  }, []);

  const processImage = useCallback(
    (imageUrl: string, imageCallback: (image: HTMLImageElement) => void) => {
      const cachedImage = imageCache.get(imageUrl);
      if (cachedImage !== undefined) {
        imageCallback(cachedImage);

        return () => {
          // Do nothing; always returning a function for better ergonomics
        };
      }

      let processingCanceled = false;

      getImage(imageUrl).then((image) => {
        if (!processingCanceled) {
          imageCallback(image);
        }
      });

      return () => {
        processingCanceled = true;
      };
    },
    []
  );

  return { loadImage, processImage } as const;
}
