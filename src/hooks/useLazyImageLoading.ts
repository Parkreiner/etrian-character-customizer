/**
 * @file Provides a very dumb, lo-fi way of lazy-loading images, while making
 * info about the images themselves available as state throughout the React app.
 */
import { useCallback, useEffect, useSyncExternalStore } from "react";

type NotificationInfo = { mutable_notifyAfterLoad: boolean };
type ReactSnapshot = Readonly<
  | { status: "idle" | "loading"; image: null; error: null }
  | { status: "error"; image: null; error: Error }
  | { status: "success"; image: HTMLImageElement; error: null }
>;

const defaultSnapshot = {
  status: "idle",
  image: null,
  error: null,
} as const satisfies ReactSnapshot;

class ImageCache {
  #cache = new Map<string, HTMLImageElement>();
  #snapshots = new Map<string, ReactSnapshot>();
  #subscriptions = [] as (() => void)[];

  addSubscription(callback: () => void): void {
    this.#subscriptions.push(callback);
  }

  removeSubscription(callback: () => void): void {
    this.#subscriptions = this.#subscriptions.filter((cb) => cb !== callback);
  }

  notifySubscribers(): void {
    this.#subscriptions.forEach((cb) => cb());
  }

  getImage(imgUrl: string): HTMLImageElement | null {
    return this.#cache.get(imgUrl) ?? null;
  }

  getSnapshot(imgUrl: string): ReactSnapshot {
    return this.#snapshots.get(imgUrl) ?? defaultSnapshot;
  }

  addSnapshot(imgUrl: string, snapshot: ReactSnapshot): void {
    this.#snapshots.set(imgUrl, snapshot);
    this.notifySubscribers();
  }

  addImage(
    imgUrl: string,
    newImage: HTMLImageElement,
    notifyAfterAdd = true
  ): void {
    this.#cache.set(imgUrl, newImage);

    this.#snapshots.set(imgUrl, {
      status: "success",
      image: newImage,
      error: null,
    });

    if (notifyAfterAdd) {
      this.notifySubscribers();
    }
  }

  fetchImage(
    imageUrl: string,
    info: NotificationInfo
  ): Promise<HTMLImageElement> {
    const prevImage = this.getImage(imageUrl);
    if (prevImage !== null) {
      return Promise.resolve(prevImage);
    }

    this.addSnapshot(imageUrl, { status: "loading", image: null, error: null });
    const characterImage = new Image();

    return new Promise((resolve, reject) => {
      characterImage.onload = () => {
        this.addImage(imageUrl, characterImage, info.mutable_notifyAfterLoad);
        resolve(characterImage);
      };

      characterImage.onerror = (err) => {
        const parsedError =
          err instanceof Error
            ? err
            : new Error(`Non-error ${JSON.stringify(err)} thrown`);

        this.addSnapshot(imageUrl, {
          status: "error",
          image: null,
          error: parsedError,
        });

        reject(parsedError);
      };

      characterImage.src = imageUrl;
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

export default function useLazyImageLoading(imageUrl: string) {
  const { image, status, error } = useSyncExternalStore(subscribe, () =>
    cache.getSnapshot(imageUrl)
  );

  useEffect(() => {
    if (error === null) return;
    console.error(error);
  }, [error]);

  const loadImage = useCallback((newImageUrl: string) => {
    const info: NotificationInfo = { mutable_notifyAfterLoad: true };

    const promise = cache.fetchImage(newImageUrl, info);
    const abort = () => {
      info.mutable_notifyAfterLoad = false;
    };

    return { promise, abort } as const;
  }, []);

  return { image, status, loadImage } as const;
}
