/**
 * Makes sure that if a hue value would be incremented/decremented outside the
 * range of 0-359, the value wraps around to the opposite end, like a circle.
 */
export function wrapHue(intermediateHue: number) {
  return intermediateHue < 0 ? 359 : intermediateHue % 360;
}
