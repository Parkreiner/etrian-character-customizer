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

  const onMouseDown = useCallback(
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

  const cancelMouseDown = useCallback(() => {
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
    onMouseDown,

    /**
     * Must be attached to BOTH the onMouseUp and onMouseLeave events
     */
    cancelMouseDown,
  } as const;
}
