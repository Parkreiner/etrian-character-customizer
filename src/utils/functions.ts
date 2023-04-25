export function debounce<Args extends unknown[]>(
  callback: (...args: Args) => void,
  debounceTimeMs: number
): (...args: Args) => void {
  if (debounceTimeMs === 0) {
    return callback;
  }

  if (!Number.isInteger(debounceTimeMs) || debounceTimeMs < 0) {
    throw new RangeError(
      `Provided debounce time ${debounceTimeMs} is not an integer greater than 0.`
    );
  }

  let timeoutId = 0;

  return function debounced(...args: Parameters<typeof callback>): void {
    if (timeoutId !== 0) {
      window.clearTimeout(timeoutId);
    }

    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, debounceTimeMs);
  };
}
