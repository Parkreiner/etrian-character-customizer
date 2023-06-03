/**
 * @file Provides a very dumb, lo-fi way of lazy-loading images, while making
 * info about the images themselves available as state throughout the React app.
 */
import { useCallback, useEffect, useSyncExternalStore } from "react";

const MAX_RETRY_COUNT = 3;

type NotificationInfo = { mutable_notifyAfterLoad: boolean };

type ReactSnapshot = Readonly<
  | { status: "idle" | "loading"; bitmap: null; error: null }
  | { status: "success"; bitmap: ImageBitmap; error: null }
  | { status: "error"; bitmap: null; error: Error }
>;

class ImageCache {
  #mutableCache = new Map<string, HTMLImageElement>();
  #immutableSnapshots = new Map<string, ReactSnapshot>();
  #subscriptions: (() => void)[] = [];

  static defaultSnapshot = {
    status: "idle",
    bitmap: null,
    error: null,
  } as const satisfies ReactSnapshot;

  #notifySubscribers(): void {
    this.#subscriptions.forEach((cb) => cb());
  }

  #onRequest(imgUrl: string, image: HTMLImageElement): void {
    this.#mutableCache.set(imgUrl, image);
    this.#immutableSnapshots.set(imgUrl, {
      status: "loading",
      bitmap: null,
      error: null,
    });

    this.#notifySubscribers();
  }

  #onError(imgUrl: string, errorValue: unknown): void {
    const parsedError =
      errorValue instanceof Error
        ? errorValue
        : new Error(`Non-error value ${JSON.stringify(errorValue)} thrown`);

    this.#immutableSnapshots.set(imgUrl, {
      status: "error",
      bitmap: null,
      error: parsedError,
    });

    this.#notifySubscribers();
  }

  async #onSuccess(
    imgUrl: string,
    image: HTMLImageElement,
    notifyAfterAdd = true
  ): Promise<void> {
    if (image.src === "" || !image.complete) {
      return;
    }

    // Await operation should have no risks of throwing as long as the previous
    // checks are in place
    const newBitmap = await window.createImageBitmap(image);

    this.#immutableSnapshots.set(imgUrl, {
      status: "success",
      bitmap: newBitmap,
      error: null,
    });

    if (notifyAfterAdd) {
      this.#notifySubscribers();
    }
  }

  addSubscription(callback: () => void): void {
    this.#subscriptions.push(callback);
  }

  removeSubscription(callback: () => void): void {
    this.#subscriptions = this.#subscriptions.filter((cb) => cb !== callback);
  }

  getImage(imgUrl: string): HTMLImageElement | null {
    return this.#mutableCache.get(imgUrl) ?? null;
  }

  getSnapshot(imgUrl: string): ReactSnapshot {
    return this.#immutableSnapshots.get(imgUrl) ?? ImageCache.defaultSnapshot;
  }

  requestImage(
    imgUrl: string,
    info: NotificationInfo
  ): Promise<HTMLImageElement> {
    const prevImage = this.getImage(imgUrl);
    const prevSnapshot = this.getSnapshot(imgUrl);

    const canReuseImage =
      prevImage !== null && prevSnapshot.status === "success";

    if (canReuseImage) {
      return Promise.resolve(prevImage);
    }

    const newImage = new Image();
    let retryCount = 0;

    const setupImageWithRetries = (
      resolve: (image: HTMLImageElement) => void,
      reject: (err: unknown) => void
    ) => {
      this.#onRequest(imgUrl, newImage);

      newImage.onload = () => {
        this.#onSuccess(imgUrl, newImage, info.mutable_notifyAfterLoad);
        resolve(newImage);
      };

      newImage.onerror = (err) => {
        this.#onError(imgUrl, err);
        reject(err);

        retryCount++;
        if (retryCount <= MAX_RETRY_COUNT) {
          new Promise(setupImageWithRetries);
        }
      };

      newImage.src = imgUrl;
    };

    return new Promise(setupImageWithRetries);
  }
}

const cache = new ImageCache();

function subscribe(notifyReact: () => void) {
  cache.addSubscription(notifyReact);
  return () => cache.removeSubscription(notifyReact);
}

export default function useLazyImageLoading(imgUrl: string) {
  const { bitmap, status, error } = useSyncExternalStore(subscribe, () =>
    cache.getSnapshot(imgUrl)
  );

  useEffect(() => {
    if (error === null) return;
    console.error(error);
  }, [error]);

  const loadImage = useCallback((newImgUrl: string) => {
    const info: NotificationInfo = { mutable_notifyAfterLoad: true };

    const promise = cache.requestImage(newImgUrl, info);
    const abort = () => {
      info.mutable_notifyAfterLoad = false;
    };

    return { promise, abort } as const;
  }, []);

  return { bitmap, status, loadImage } as const;
}
