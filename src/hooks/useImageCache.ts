/**
 * @todo Also need to export a cache snapshot from the hook so that the cache
 * can start to be used with React state
 */
import { useCallback, useSyncExternalStore } from "react";

type MutableNotifierInfo = { notify: boolean };

class ImageCache {
  #cache = new Map<string, HTMLImageElement>();
  #subscriptions = [] as (() => void)[];

  addSubscription(callback: () => void): void {
    this.#subscriptions.push(callback);
  }

  removeSubscription(callback: () => void): void {
    this.#subscriptions = this.#subscriptions.filter((cb) => cb !== callback);
  }

  get(imgUrl: string): HTMLImageElement | null {
    return this.#cache.get(imgUrl) ?? null;
  }

  set(imgUrl: string, newImage: HTMLImageElement, notifySubscribers = true) {
    this.#cache.set(imgUrl, newImage);

    if (notifySubscribers) {
      this.#subscriptions.forEach((cb) => cb());
    }
  }

  loadImage(
    url: string,
    info: MutableNotifierInfo = { notify: true }
  ): Promise<HTMLImageElement> {
    const characterImage = new Image();
    return new Promise((resolve, reject) => {
      characterImage.onload = () => {
        this.set(url, characterImage, info.notify);
        resolve(characterImage);
      };

      characterImage.onerror = reject;
      characterImage.src = url;
    });
  }
}

const cache = new ImageCache();

function subscribe(notifyReact: () => void) {
  cache.addSubscription(notifyReact);

  return function unsubscribe() {
    cache.removeSubscription(notifyReact);
  };
}

type ImageInfo =
  | { loaded: false }
  | { loaded: true; width: number; height: number };

export default function useImageCache(imageUrl: string) {
  const image = useSyncExternalStore(subscribe, () => cache.get(imageUrl));
  const imageInfo: ImageInfo =
    image === null
      ? { loaded: false }
      : { loaded: true, width: image.width, height: image.height };

  const processImage = useCallback(
    (imageCallback: (image: HTMLImageElement) => void) => {
      const info: MutableNotifierInfo = { notify: true };
      const cleanup = () => {
        info.notify = false;
      };

      const cachedImage = cache.get(imageUrl);
      if (cachedImage !== null) {
        imageCallback(cachedImage);
        return cleanup;
      }

      cache.loadImage(imageUrl, info).then((image) => {
        if (info.notify) {
          imageCallback(image);
        }
      });

      return cleanup;
    },
    [imageUrl]
  );

  const loadNewImage = useCallback((newImageUrl: string) => {
    return cache.loadImage(newImageUrl);
  }, []);

  return { imageInfo, processImage, loadNewImage } as const;
}
