/**
 * @file Provides a very simple, lo-fi way of lazy-loading images, while making
 * the images themselves available as state throughout the React app.
 *
 * This hook assumes that images will never need to be invalidated from the
 * cache, so your only options are getting an image state value, or loading a
 * new image.
 */
import { useCallback, useSyncExternalStore } from "react";

type MutableNotificationInfo = { notify: boolean };

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
    info: MutableNotificationInfo
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

export default function useImageCache(imageUrl: string) {
  const image = useSyncExternalStore(subscribe, () => cache.get(imageUrl));

  const loadImage = useCallback((newImageUrl: string) => {
    const info: MutableNotificationInfo = { notify: true };
    cache.loadImage(newImageUrl, info);

    return () => {
      info.notify = false;
    };
  }, []);

  return { image, loadImage } as const;
}
