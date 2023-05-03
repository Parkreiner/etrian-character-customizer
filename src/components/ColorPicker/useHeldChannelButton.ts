/**
 * @file A custom hook for managing logic for holding down buttons for various
 * inputs inside ColorPicker.
 *
 * May end up needing to generalize this into a more reusable hook down the
 * line.
 */
import { useCallback, useEffect, useRef } from "react";

export default function useHeldChannelButton(
  value: number,
  valueChangeCallback: (newValue: number) => void
) {
  const mouseHoldIdRef = useRef(0);
  const channelCallbackRef = useRef(valueChangeCallback);

  useEffect(() => {
    channelCallbackRef.current = valueChangeCallback;
  }, [valueChangeCallback]);

  const handleInput = useCallback(
    (valueOffset: -1 | 1) => {
      let localValue = value + valueOffset;
      channelCallbackRef.current(localValue);

      mouseHoldIdRef.current = window.setTimeout(() => {
        mouseHoldIdRef.current = window.setInterval(() => {
          localValue += valueOffset;
          channelCallbackRef.current(localValue);
        }, 100);
      }, 600);
    },
    [value]
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent, valueOffset: -1 | 1) => {
      const { code, repeat } = event;
      if (repeat || (code !== "Space" && code !== "Enter")) return;

      event.preventDefault();
      handleInput(valueOffset);
    },
    [handleInput]
  );

  const cleanUpHeldInput = useCallback(() => {
    if (mouseHoldIdRef.current !== 0) {
      window.clearTimeout(mouseHoldIdRef.current);
      window.clearInterval(mouseHoldIdRef.current);
      mouseHoldIdRef.current = 0;
    }
  }, []);

  return {
    /**
     * Sets up the main click logic. Do NOT assign to onClick; always use
     * onMouseDown. Things will break if you use onClick.
     */
    onMouseDown: handleInput,

    /**
     * Works like onMouseDown, but is for handling keyboard input for the Space
     * and Enter keys.
     *
     * Should always be attached to something when this hook is being used, just
     * for accessibility reasons.
     */
    onKeyDown,

    /**
     * Must be attached to ALL of these events:
     * - onMouseUp
     * - onMouseLeave
     * - onKeyUp
     */
    cleanUpHeldInput,
  } as const;
}
