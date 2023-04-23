export function debounce<Args extends unknown[]>(
  callback: (...args: Args) => void,
  timeMs: number
): typeof callback {
  let timeoutId = 0;

  return function debounced(...args: Parameters<typeof callback>): void {
    if (timeoutId !== 0) {
      window.clearTimeout(timeoutId);
    }

    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, timeMs);
  } as typeof callback;
}
