/**
 * Makes sure that if a hue value would be incremented/decremented outside the
 * range of 0-359, the value wraps around to the opposite end, like a circle.
 */
export function wrapHue(unwrappedHue: number) {
  const constrained = unwrappedHue % 360;
  return constrained < 0 ? 360 + constrained : constrained;
}
