/**
 * @file A custom hook for managing logic for holding down buttons for various
 * inputs inside ColorPicker.
 *
 * Make sure that you attach ALL functions that this hook creates. Otherwise,
 * your component will break and/or have terrible accessibility.
 *
 * Logic is specific to ColorPicker; will probably need more work to make the
 * hook viable for other components.
 *
 * Tried seeing if it was possible to just have this hook return a ref, and have
 * the hook manage adding/removing all the event listeners for whatever you
 * attach the ref to. The problem is that some of the functions require input
 * from the component you're using the hook from. There's no way to pass that
 * info along with just a ref, so we're stuck with the clunky abstraction.
 */
import { useCallback, useRef } from "react";

export default function useHeldChannelButton(
  value: number,
  valueChangeCallback: (newValue: number) => void
) {
  const mouseHoldIdRef = useRef(0);

  // Doesn't make sense to wrap this in useCallback, because value will be
  // changing very often
  const handleInput = (valueOffset: -1 | 1) => {
    let localValue = value + valueOffset;
    valueChangeCallback(localValue);

    mouseHoldIdRef.current = window.setTimeout(() => {
      mouseHoldIdRef.current = window.setInterval(() => {
        localValue += valueOffset;
        valueChangeCallback(localValue);
      }, 100);
    }, 600);
  };

  // Also doesn't make sense to wrap this in useCallback, because it calls
  // handleInput and would need it as a dependency
  const onKeyDown = (event: React.KeyboardEvent, valueOffset: -1 | 1) => {
    const { code, repeat } = event;
    if (repeat || (code !== "Space" && code !== "Enter")) return;

    event.preventDefault();
    handleInput(valueOffset);
  };

  const cleanUpHeldInput = useCallback(() => {
    if (mouseHoldIdRef.current !== 0) {
      window.clearTimeout(mouseHoldIdRef.current);
      window.clearInterval(mouseHoldIdRef.current);
      mouseHoldIdRef.current = 0;
    }
  }, []);

  /**
   * Do NOT use the onClick event handler for any component that uses these
   * methods. It's great for accessibility (mouse and keyboard support right out
   * of the box), but it's terrible at managing held inputs.
   *
   * Adding the onClick handler is very likely to make your component break.
   */
  return {
    onKeyDown,
    onKeyUp: cleanUpHeldInput,
    onMouseDown: handleInput,
    onMouseUp: cleanUpHeldInput,
    onMouseLeave: cleanUpHeldInput,
  } as const;
}
