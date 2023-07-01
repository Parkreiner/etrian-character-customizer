/**
 * @file Provides a very dumb, lo-fi way of lazy-loading images, while making
 * info about the images themselves available as state throughout the React app.
 */
import { useCallback, useSyncExternalStore } from "react";
import useErrorLoggingEffect from "@/hooks/useErrorLoggingEffect";

const MAX_RETRY_COUNT = 3;

type NotificationInfo = { mutable_notifyAfterLoad: boolean };

type ReactSnapshot = Readonly<
  | { status: "unloaded" | "loading"; bitmap: null; error: null }
  | { status: "success"; bitmap: ImageBitmap; error: null }
  | { status: "error"; bitmap: null; error: Error }
>;

class ImageCache {
  #mutableCache = new Map<string, HTMLImageElement>();
  #immutableSnapshots = new Map<string, ReactSnapshot>();
  #subscriptions: (() => void)[] = [];

  static defaultSnapshot = {
    status: "unloaded",
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
      this.#immutableSnapshots.set(imgUrl, {
        status: "error",
        bitmap: null,
        error: new Error("Image load succeeded, but no data available"),
      });

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

  getSnapshot(imgUrl: string | null): ReactSnapshot {
    if (imgUrl === null) return ImageCache.defaultSnapshot;
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

    /**
     * @todo It feels like there's a logic issue here where if a request gets
     * sent for an image has a pending request already, there's no logic to
     * consolidate those requests. The newer request just completely overrides
     * the previous one.
     *
     * It hasn't been a problem so far, but I could see this breaking things.
     * Maybe not, though? Even if there are independent Promises, they should
     * each fulfill simultaneously once the same, shared image loads, maybe?
     * It's screwy, and it breaks my mind, though, so I'd rather do more than
     * just pray that the micro-task queue bails me out
     */
    if (canReuseImage) {
      return Promise.resolve(prevImage);
    }

    const newImage = new Image();
    if ("fetchPriority" in newImage) {
      newImage.fetchPriority = info.mutable_notifyAfterLoad ? "high" : "low";
    }

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

export function useLazyImageLoader() {
  return useCallback((imgUrl: string, notifyAfterLoad = true) => {
    const info: NotificationInfo = {
      mutable_notifyAfterLoad: notifyAfterLoad,
    };

    const promise = cache.requestImage(imgUrl, info);
    const abort = () => {
      info.mutable_notifyAfterLoad = false;
    };

    return { promise, abort } as const;
  }, []);
}

function subscribeReactToCache(notifyReact: () => void) {
  cache.addSubscription(notifyReact);
  return () => cache.removeSubscription(notifyReact);
}

export default function useBitmapManager(imgUrl: string | null) {
  const { bitmap, status, error } = useSyncExternalStore(
    subscribeReactToCache,
    () => cache.getSnapshot(imgUrl)
  );

  const loadImage = useLazyImageLoader();
  useErrorLoggingEffect(error);

  return { bitmap, status, loadImage } as const;
}
